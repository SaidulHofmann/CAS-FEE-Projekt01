export function requestAsync(metod, url, data, headers) {
    return $.ajax({
        dataType: "json",
        contentType: "application/json",
        headers: headers,
        method: metod,
        url: url,
        data: data ? JSON.stringify(data) : undefined
    });
}
