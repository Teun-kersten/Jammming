const clientId = "0ea26ce8e3a54b0ca89432c86978a8fa";
const redirectUri = "http://127.0.0.1:5173/";

let accessToken = "";

const generateRandomString = (length) => {
    const possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    const values = crypto.getRandomValues(new Uint8Array(length));
    return values.reduce((acc, x) => acc + possible[x % possible.length], "");
};

const sha256 = async (plain) => {
    const encoder = new TextEncoder();
    const data = encoder.encode(plain);
    return window.crypto.subtle.digest("SHA-256", data);
};

const base64Encode = (input) => {
    return btoa(String.fromCharCode(...new Uint8Array(input)))
        .replace(/=/g, "")
        .replace(/\+/g, "-")
        .replace(/\//g, "_");
};

async function parseJsonSafe(response, label) {
    const rawText = await response.text();
    if (!response.ok) {
        console.error(`${label} mislukt (HTTP ${response.status}):`, rawText);
        return null;
    }
    if (!rawText) {
        console.error(`${label} gaf een lege response terug.`);
        return null;
    }
    try {
        return JSON.parse(rawText);
    } catch (err) {
        console.error(`${label} gaf geen geldige JSON terug:`, rawText);
        return null;
    }
}

const Spotify = {
    async getAccessToken() {
        if (accessToken) {
            return accessToken;
        }

        const urlParams = new URLSearchParams(window.location.search);
        const code = urlParams.get("code");
        const error = urlParams.get("error");

        if (error) {
            console.error("Spotify authorization error:", error);
            window.history.pushState({}, document.title, "/");
            return null;
        }

        if (code) {
            const storedVerifier = localStorage.getItem("code_verifier");

            const response = await fetch("https://accounts.spotify.com/api/token", {
                method: "POST",
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded",
                },
                body: new URLSearchParams({
                    client_id: clientId,
                    grant_type: "authorization_code",
                    code: code,
                    redirect_uri: redirectUri,
                    code_verifier: storedVerifier
                })
            });

            const data = await parseJsonSafe(response, "Token exchange");
            if (!data) {
                return null;
            }

            if (data.access_token) {
                accessToken = data.access_token;
                const expiresIn = Number(data.expires_in);
                window.setTimeout(() => (accessToken = ""), expiresIn * 1000);
                window.history.pushState({}, document.title, "/");
                localStorage.removeItem("code_verifier");
                return accessToken;
            }
        }

        const newCodeVerifier = generateRandomString(64);
        const hashed = await sha256(newCodeVerifier);
        const codeChallenge = base64Encode(hashed);

        localStorage.setItem("code_verifier", newCodeVerifier);

        const scope = "playlist-modify-public playlist-modify-private";
        const authUrl = new URL("https://accounts.spotify.com/authorize");

        authUrl.search = new URLSearchParams({
            response_type: "code",
            client_id: clientId,
            scope: scope,
            code_challenge_method: "S256",
            code_challenge: codeChallenge,
            redirect_uri: redirectUri
        }).toString();

        window.location.href = authUrl.toString();
    },

    async search(term) {
        if (!term || !term.trim()) {
            return [];
        }

        const token = await this.getAccessToken();
        if (!token) {
            return [];
        }

        const response = await fetch(
            `https://api.spotify.com/v1/search?type=track&q=${encodeURIComponent(term.trim())}`,
            {
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            }
        );

        const jsonResponse = await parseJsonSafe(response, "Spotify search");
        if (!jsonResponse || !jsonResponse.tracks || !jsonResponse.tracks.items) {
            return [];
        }

        return jsonResponse.tracks.items.map(track => ({
            id: track.id,
            name: track.name,
            artist: track.artists[0].name,
            album: track.album.name,
            uri: track.uri
        }));
    },
    
    async savePlaylist(name, trackUris) {
        if (!name || !Array.isArray(trackUris) || trackUris.length === 0) {
            return false;
        }

        const token = await this.getAccessToken();
        if (!token) {
            return false;
        }

        const headers = {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json"
        };

        // 1. Gebruikers-ID ophalen
        const userResponse = await fetch("https://api.spotify.com/v1/me", {
            headers: { "Authorization": `Bearer ${token}` }
        });
        const userData = await parseJsonSafe(userResponse, "Get user profile");
        if (!userData || !userData.id) {
            return false;
        }
        const userId = userData.id;

        // 2. Nieuwe playlist aanmaken
     const createResponse = await fetch(
            "https://api.spotify.com/v1/me/playlists",
            {
                method: "POST",
                headers,
                body: JSON.stringify({
                    name: name,
                    description: "Created with Jammming",
                    public: false
                })
            }
        );
        const playlistData = await parseJsonSafe(createResponse, "Create playlist");
        if (!playlistData || !playlistData.id) {
            return false;
        }
        const playlistId = playlistData.id;

       // 3. Tracks toevoegen aan de nieuwe playlist
        const addTracksResponse = await fetch(
            `https://api.spotify.com/v1/playlists/${playlistId}/items`,
            {
                method: "POST",
                headers,
                body: JSON.stringify({
                    uris: trackUris
                })
            }
        );
        const addTracksData = await parseJsonSafe(addTracksResponse, "Add tracks to playlist");
        return Boolean(addTracksData);
    }
};

export default Spotify;