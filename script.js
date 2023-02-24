class App {
	constructor() {
		this._username = "";
		this.baseUrl = "http://localhost:5001";
	}

	loadTweets() {
		axios.get(`${this.baseUrl}/tweets`).then((res) => {
			const tweets = res.data;
			let tweetsHtml = "";

			for (const tweet of tweets) {
				tweetsHtml += `
          <div class="tweet">
            <div class="avatar">
              <img src="${tweet.avatar}" />
            </div>
            <div class="content">
              <div class="user" onclick="app.loadTweetsOfUser('${
								tweet.username
							}')">
                @${tweet.username}
              </div>
              <div class="body">
                ${this.escapeHtml(tweet.tweet)}
              </div>
            </div>
          </div>
        `;
			}

			document.querySelector(".tweets").innerHTML = tweetsHtml;
			document.querySelector(".pagina-inicial").classList.add("hidden");
			document.querySelector(".tweets-page").classList.remove("hidden");
		});
	}

	loadTweetsOfUser(username) {
		axios.get(`${this.baseUrl}/tweets/${username}`).then((res) => {
			const tweets = res.data;
			let tweetsHtml = '<button onclick="app.loadTweets()">< voltar</button>';

			for (const tweet of tweets) {
				tweetsHtml += `
          <div class="tweet">
            <div class="avatar">
              <img src="${tweet.avatar}" />
            </div>
            <div class="content">
              <div class="user">
                @${tweet.username}
              </div>
              <div class="body">
                ${this.escapeHtml(tweet.tweet)}
              </div>
            </div>
          </div>
        `;
			}

			document.querySelector(".tweets").innerHTML = tweetsHtml;
		});
	}

	signUp() {
		const username = document.querySelector("#username").value;
		const picture = document.querySelector("#picture").value;

		axios
			.post(`${this.baseUrl}/sign-up`, {
				username,
				avatar: picture,
			})
			.then(() => {
				this._username = username;
				this.loadTweets();
			})
			.catch((err) => {
				console.error(err);
				alert("Erro ao fazer cadastro! Consulte os logs.");
			});
	}

	postTweet() {
		const tweet = document.querySelector("#tweet").value;

		axios
			.post(`${this.baseUrl}/tweets`, {
				username: this._username,
				tweet,
			})
			.then(() => {
				document.querySelector("#tweet").value = "";
				this.loadTweets();
			})
			.catch((err) => {
				console.error(err);
				alert("Erro ao fazer tweet! Consulte os logs.");
			});
	}

	escapeHtml(unsafe) {
		return unsafe
			.replace(/&/g, "&amp;")
			.replace(/</g, "&lt;")
			.replace(/>/g, "&gt;")
			.replace(/"/g, "&quot;")
			.replace(/'/g, "&#039;");
	}
}

const app = new App();

const [[btnEnviar], [btnEnviarTweet]] = ["btn-enviar", "btn-enviar-tweet"].map(
	(classname) => document.getElementsByClassName(classname)
);

btnEnviar.addEventListener("click", () => app.signUp());
btnEnviarTweet.addEventListener("click", () => app.postTweet());
