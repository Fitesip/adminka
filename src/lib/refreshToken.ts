export const refreshToken = async () => {
    try {
        const res = await fetch(`https://testapi.animalmore.ru/auth/auth/update-tokens`, {
            method: 'POST',
            credentials: 'include' // send refresh cookie
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || 'Refresh failed');
        sessionStorage.setItem('token', data.accessToken);
    } catch (err) {
        //@ts-expect-error 'err' is of type 'unknown'.
        console.log(err.message);
    }
}