FROM node:23-slim

RUN apt-get update \
	&& apt-get install -y wget gnupg \
	&& wget -q -O - https://dl-ssl.google.com/linux/linux_signing_key.pub | apt-key add - \
	&& sh -c 'echo "deb [arch=amd64] http://dl.google.com/linux/chrome/deb/ stable main" >> /etc/apt/sources.list.d/google.list' \
	&& apt-get update \
	&& apt-get install -y google-chrome-stable fonts-ipafont-gothic fonts-wqy-zenhei fonts-thai-tlwg fonts-kacst fonts-freefont-ttf libxss1 \
	--no-install-recommends \
	&& rm -rf /var/lib/apt/lists/*

ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true

WORKDIR /home/pptruser/screenshotter
COPY ./package.json .
COPY ./index.js .

# Install puppeteer so it's available in the container.
RUN npm i  \
	# Add user so we don't need --no-sandbox.
	# same layer as npm install to keep re-chowned files from using up several hundred MBs more space
	&& groupadd -r pptruser && useradd -r -g pptruser -G audio,video pptruser \
	&& mkdir -p /home/pptruser/Downloads \
	&& chown -R pptruser:pptruser /home/pptruser

CMD ["node", "index.js"]
