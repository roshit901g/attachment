const GetFile = async (accessToken, driveItem) => {
    // alert("");
    const resp = await fetch(`https://graph.microsoft.com/v1.0/me/drive/items/${driveItem}`, {
        headers: {
            'Content-Type': 'application/json',
            "Accept": "application/json;odata.metadata=minimal;odata.streaming=true;IEEE754Compatible=false",
            "Authorization": `Bearer ${accessToken}`
        },
    });
    const data = await resp.json();
    // console.log("Data", data);
    return data;
}
export default GetFile;