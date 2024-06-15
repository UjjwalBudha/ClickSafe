from fastapi import FastAPI
from fastapi.responses import JSONResponse
from fastapi.encoders import jsonable_encoder
from pydantic import BaseModel
from typing import List
import json
from google.cloud import webrisk_v1
from google.cloud.webrisk_v1 import SearchUrisResponse
from google.api_core.exceptions import InvalidArgument
from google.api_core.exceptions import InvalidArgument
from fastapi.middleware.cors import CORSMiddleware


app = FastAPI()
allowed_origins = [
    # "http://threatswebsitelinks.com.s3-website-us-east-1.amazonaws.com",
    "*"  
]

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,  # List of allowed origins
    allow_credentials=True,
    allow_methods=["*"],  # Allows all methods
    allow_headers=["*"],  # Allows all headers
)

class URLList(BaseModel):
    urls: List[str]


def check_status(urls_pool):
    webrisk_client = webrisk_v1.WebRiskServiceClient()
    url_with_status = {}
    for each_url in urls_pool:
        if each_url.startswith("javascript:") or "void(0)" in each_url:
            print(f"Skipping invalid URL: {each_url}")
            continue
        request = webrisk_v1.SearchUrisRequest()
        request.threat_types = [webrisk_v1.ThreatType.MALWARE, webrisk_v1.ThreatType.SOCIAL_ENGINEERING, webrisk_v1.ThreatType.UNWANTED_SOFTWARE]
        request.uri = each_url
        # Skip invalid URLs
        try:
            response = webrisk_client.search_uris(request)
        except InvalidArgument as err:
            print(f"error {err}")

        print("response", response)
        if response.threat.threat_types != []:
            print("response from if block", response)
            print(f"The URL '{each_url}' has the following threat: {response}")
            url_with_status[each_url]=True
        else:
            # print('each_url', each_url)
            url_with_status[each_url]=False
    return url_with_status


@app.post("/validate_urls/")
def validate_urls(url_list: URLList):
    print(type(url_list.urls))
    urls_pool = url_list.urls
    # urls_pool = [url for url in url_list.urls]
    response = check_status(urls_pool)
    print(response)
    return JSONResponse(status_code=200, content=response)
           
    
    
  
         
  
    print(type(urls_pool))
    # validated_urls = [{"url": url, "valid": True} for url in url_list.urls]  # Replace with actual validation logic
    # print (type(validated_urls))
    # for i in validated_urls:
    #     print(i)

    #return validated_urls


if __name__ =="__main__":
    import uvicorn
    uvicorn.run(app, host ="127.0.0.1", port =8000)



