import os
import time
import threading
import signal
import json
from web3 import Web3
from youtube_transcript_api import YouTubeTranscriptApi
from openai import OpenAI

OPENAI_API_KEY = os.environ.get("OPENAI_API_KEY")
PRIVATE_KEY = os.environ.get("PRIVATE_KEY")

# Global variable to track program termination
terminate_program = False


def get_captions(video_id):
    try:
        # Fetch caption segments from YouTube
        transcript = YouTubeTranscriptApi.get_transcript(video_id)
        return transcript
    except Exception as e:
        print(f"Error retrieving transcript: {e}")
        return None


def get_video_id(url):
    """
    Extract the video ID from a YouTube URL.
    """
    try:
        if "youtu.be/" in url:
            return url.split("/")[-1]
        elif "v=" in url:
            return url.split("v=")[1].split("&")[0]
        else:
            raise ValueError("Invalid YouTube URL format.")
    except Exception as e:
        print(f"Error parsing video ID: {e}")
        return None


def process_caption(captions):
    """
    Concatenate captions into a single string.
    """
    final_caption = ""
    if captions:
        for entry in captions:
            final_caption += " " + entry['text']
        return final_caption.strip()
    else:
        print("No captions found or could not retrieve captions.")
        return None


def analyze_caption_with_gpt(caption_text, task_content):
    """
    Use OpenAI GPT to analyze whether the task content is mentioned in the caption.
    """
    try:
        client = OpenAI()
        prompt = (
            f"Given the following caption: \"{caption_text}\"\n\n"
            f"You are an assistant tasked with determining if the following task content was mentioned in the caption: \"{task_content}\"\n\n"
            "Respond with only 'true' or 'false'."
        )

        response = client.chat.completions.create(
            model="gpt-4",
            messages=[{"role": "system", "content": prompt}],
        )
        result = response.choices[0].message.content.strip().lower()
        print(f"Result from caption analysis: {result}")
        return result == "true"
    except Exception as e:
        print(f"Error analyzing caption with GPT: {e}")
        return False


def decode_log(log, contract):
    """
    Decode the log data for the specified event.
    """
    try:
        decoded_event = contract.events.NewTaskCreated().process_log(log)
        return decoded_event
    except Exception as e:
        print(f"Error decoding log: {e}")
        return None


def monitor_smart_contract_event(w3, contract_address, contract_abi, event_name, poll_interval=5):
    """
    Monitor smart contract events and process them in real time.
    """
    def poll_events():
        contract = w3.eth.contract(address=Web3.to_checksum_address(contract_address), abi=contract_abi)

        # Create an event filter starting from the latest block
        event_filter = contract.events[event_name].create_filter(from_block='latest')

        print(f"Listening for {event_name} events from contract {contract_address}...")
        # SIGNER_ADDRESS = os.environ.get("SIGNER_ADDRESS")
        SIGNER_ADDRESS = "0xA39a7105968d6F193c42Ac1995db54BAE6CE4024"
        signer_address = Web3.to_checksum_address(SIGNER_ADDRESS)
        print(f"signer address: {signer_address}")
        while not terminate_program:
            try:
                new_events = event_filter.get_new_entries()
                print(f"New events: {new_events}")

                nonce = w3.eth.get_transaction_count(signer_address)
                print(f"Nonce: {nonce}")
                for evt in new_events:
                    decoded_event = evt['args']
                    if decoded_event:
                        task_index = decoded_event["taskIndex"]
                        task = decoded_event["task"]
                        video_url = task["video_url"]
                        task_content = task["task_content"]
                        print(f"New task detected! Task Index: {task_index}, Video URL: {video_url}, Task Content: {task_content}")

                        video_id = get_video_id(video_url)
                        if not video_id:
                            print("Failed to extract video ID. Skipping task.")
                            continue

                        captions = get_captions(video_id)
                        processed_captions = process_caption(captions)
                        print(f"Length of processed captions: {len(processed_captions)}")

                        if not processed_captions:
                            print("No captions to analyze. Skipping task.")
                            continue

                        result = analyze_caption_with_gpt(processed_captions, task_content)
                        if result:
                            print("Result: Task content was mentioned in the video captions.")
                        else:
                            print("Result: Task content was NOT mentioned in the video captions.")

                        try:
                            nonce = w3.eth.get_transaction_count(signer_address)
                            print(f"Nonce: {nonce}")
                            # sample signature
                            signature = b""
                            tx = contract.functions.respondToTask(
                                task,
                                task_index,
                                signature,
                                result
                            ).build_transaction({
                                "chainId": w3.eth.chain_id,
                                "gas": 2000000,
                                "gasPrice": w3.to_wei("20", "gwei"),
                                "nonce": nonce
                            })

                            # Sign and send the transaction
                            signed_tx = w3.eth.account.sign_transaction(tx, private_key=PRIVATE_KEY)
                            tx_hash = w3.eth.send_raw_transaction(signed_tx.raw_transaction)
                            print(f"Transaction sent: {tx_hash.hex()}")
                            print(f"Waiting for transaction receipt...")
                            receipt = w3.eth.wait_for_transaction_receipt(tx_hash)
                            print(f"Transaction receipt: {receipt}")
                        except Exception as e:
                            print(f"Error sending transaction: {e}")
                            continue

                time.sleep(poll_interval)
            except Exception as e:
                print("Error while polling events:", e)
                time.sleep(poll_interval)

    threading.Thread(target=poll_events, daemon=True).start()


def signal_handler(sig, frame):
    """
    Handle SIGINT (Ctrl+C) and terminate the program gracefully.
    """
    global terminate_program
    print("\nCtrl+C detected! Shutting down gracefully...")
    terminate_program = True
    time.sleep(1)  # Give threads time to exit
    exit(0)


def main():
    # Register the SIGINT handler
    signal.signal(signal.SIGINT, signal_handler)

    # --- SETUP WEB3 CONNECTION ---
    infura_url = "https://eth-holesky.g.alchemy.com/v2/SVjJuPD_K8GYKymD4E2QSuQF1xiarXME"
    w3 = Web3(Web3.HTTPProvider(infura_url))

    if not w3.is_connected():
        print("Could not connect to Ethereum node.")
        return

    # Get contract address and event name from environment variables
    contract_address = "0x4f698fcdaf7bbfa2d833756107530d44230f41c5"
    event_name = "NewTaskCreated"

    if not contract_address or not event_name:
        print("Error: CONTRACT_ADDRESS and EVENT_NAME environment variables must be set.")
        return

    # Load contract ABI
    try:
        with open('../hello-world-avs/abis/HelloWorldServiceManager.json', 'r') as abi_file:
            contract_abi = json.load(abi_file)
    except Exception as e:
        print(f"Error loading contract ABI: {e}")
        return

    # Start monitoring events
    monitor_smart_contract_event(w3, contract_address, contract_abi, event_name)

    # Keep the main thread alive
    while not terminate_program:
        time.sleep(1)


if __name__ == "__main__":
    main()
