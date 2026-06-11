/**
 * Cloudflare Worker para autenticação OAuth do Decap CMS com GitHub.
 */

addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request));
});

async function handleRequest(request) {
  const url = new URL(request.url);
  const path = url.pathname;

  if (path === '/auth') {
    // Redireciona para a página de autorização do GitHub
    const githubAuthUrl = `https://github.com/login/oauth/authorize?client_id=${GITHUB_CLIENT_ID}&scope=repo,user`;
    return Response.redirect(githubAuthUrl, 302);
  }

  if (path === '/callback') {
    const code = url.searchParams.get('code');
    if (!code) {
      return new Response('Missing code parameter', { status: 400 });
    }

    const tokenResponse = await fetch('https://github.com/login/oauth/access_token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({
        client_id: GITHUB_CLIENT_ID,
        client_secret: GITHUB_CLIENT_SECRET,
        code: code,
      }),
    });

    const tokenData = await tokenResponse.json();
    const accessToken = tokenData.access_token;

    if (!accessToken) {
      return new Response('Failed to obtain access token', { status: 500 });
    }

    const encodedToken = encodeURIComponent(accessToken);

    return new Response(`
      <!DOCTYPE html>
      <html>
        <body>
          <script>
            try {
              window.opener.postMessage(
                { token: decodeURIComponent('${encodedToken}'), provider: 'github' },
                window.location.origin
              );
            } finally {
              window.close();
            }
          </script>
        </body>
      </html>
    `, { headers: { 'Content-Type': 'text/html' } });
  }

  return new Response('Not Found', { status: 404 });
}