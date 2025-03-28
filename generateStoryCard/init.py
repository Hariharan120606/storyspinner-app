import azure.functions as func
import json

def main(req: func.HttpRequest) -> func.HttpResponse:
    try:
        req_body = req.get_json()
    except ValueError:
        return func.HttpResponse("Invalid JSON", status_code=400)
    
    text = req_body.get("text", "")
    if not text:
        return func.HttpResponse("Please pass text in the request body", status_code=400)
    
    # Split text into sentences (naively, based on periods) and filter out empty strings
    sentences = [s.strip() for s in text.split(".") if s.strip()]
    # Select the first 3 sentences as key highlights
    key_sentences = sentences[:3]
    
    # Build the story card HTML content
    story_card = "<h2>Story Highlights</h2>" + "".join(f"<p>{sentence}.</p>" for sentence in key_sentences)
    
    response_data = {"story_card": story_card}
    return func.HttpResponse(
        json.dumps(response_data),
        mimetype="application/json",
        status_code=200
    )
