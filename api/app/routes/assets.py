from fastapi import APIRouter, Body, Depends, Request
from mysql.connector import connect, Error
from decouple import config # type: ignore
from app.my_sql_connection_cursor import cursor, connection # type: ignore

assets_router = APIRouter()

@assets_router.get("/number-of-assets", tags=["Assets"])
async def get_total_assets(request: Request):
    query  = f"SELECT `quantity` FROM `Asset` "
    
    try:
        cursor.execute(query)
    except Error as e:
        print(e)
        return {
            "status": False,
            "msg": "Unable to get assets"
        }

    all_assets_quantity = cursor.fetchall()

    sum_of_assets = 0

    for i in all_assets_quantity:
        sum_of_assets += i[0] #type: ignore

    return {
            "status": True,
            "msg": "Retrieval successful",
            "data": {"count" : sum_of_assets}
    }
    
@assets_router.get("/assets/{number}", tags=["Assets"])
async def get_asset(request: Request, number: int):

    query = f"SELECT `number`, `quantity`,`name` FROM `asset` WHERE `number` = {number}"
    
    try:
        cursor.execute(query)
    except:
        return {
            "status": False,
            "msg": "Unable to get asset"
        }
    asset = cursor.fetchone()
    if asset == None:
        return {
            "status": False,
            "msg": "Asset does not exist"
        }
    return {
        "data": asset,
        "status": True,
        "msg": "Get asset successful"
    }

@assets_router.delete("/delete-asset/{number}", tags=["Assets"])
async def delete_asset(number):
    query = f"DELETE FROM `asset` WHERE `number` = {number}"
    try:
        cursor.execute(query)
        connection.commit() # type: ignore
    except:
        return {
            "status": False,
            "msg": "Unable to delete asset"
        }
    return {
            "status": True,
            "msg": "Asset deleted successfully"
        }

@assets_router.post("/add-asset", tags=["Assets"])
async def add_asset(request: Request):
    request_json = await request.json()
    name = request_json["name"]
    quantity = request_json["quantity"]

    query = f"SELECT COUNT(*) FROM `asset` WHERE `name` = '{name}'"
    cursor.execute(query)
    asset_exists = cursor.fetchone()
    if asset_exists[0] != 0: # type: ignore
        return {
            "status": False,
            "msg": "Asset with same name already exists"
        }

    query = f"INSERT INTO `asset` (`quantity`,`name`) VALUES ({quantity}, '{name}')"
    try:
        cursor.execute(query)
        connection.commit() # type:ignore
        return {
            "status": True,
            "msg": "Asset added successfully"
        }
    except Error as e:
        print(e)
        return {
            "status": False,
            "msg": "Unable to add asset"} 

@assets_router.put("/edit-asset/{number}", tags=["Assets"])
async def update_asset(number, request: Request):
    request_json = await request.json()
    new_asset_name = request_json["name"] #type: ignore
    new_asset_quantity = request_json["quantity"] #type: ignore

    query = f"SELECT COUNT(*) FROM `asset` WHERE `number` = {number}"
    cursor.execute(query)
    asset_exists = cursor.fetchone()
    if asset_exists[0] == 0: # type: ignore
        return {
            "status": False,
            "msg": "Asset does not exist"
        }

    query = f"UPDATE `asset` SET `name` = '{new_asset_name}', `quantity` = '{new_asset_quantity}' WHERE `number` = {number}"
    
    try:
        cursor.execute(query)
        connection.commit() # type:ignore
        return {
            "status": True,
            "msg": "Asset updated successfully"
        }
    except:
        return {
            "status": False,
            "msg": "Unable to update asset"
        }

@assets_router.get("/all-assets", tags=["Assets"])
async def get_assets(request: Request):
    query = f"SELECT `number`, `quantity`,`name` FROM `asset`"
    try:
        cursor.execute(query)
        assets = cursor.fetchall()
    except Error as e:
        print(e)
        return {
            "status": False,
            "msg": "Unable to get assets"
        }
    return {
        "data": assets,
        "status": True,
        "msg": "Get assets successful"
    }