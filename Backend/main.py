from fastapi import FastAPI

app = FastAPI()


@app.get("/")
async def root():
    return {"message": "Hello World"}

@app.get("/get_an_int")
async def get_an_int():
    return {"message": 5}

@app.get("/get_a_list_strings")
async def get_a_list_strings():
    x = ["A", "LIST", "OF", "STRINGS"]
    return {"message": x}