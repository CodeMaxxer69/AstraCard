const canvas = require("@napi-rs/canvas");
const { colorFetch } = require("../functions/colorFetch");
const { createCanvas, loadImage } = require("@napi-rs/canvas");

// Register fonts from local file paths (commented out)
// canvas.GlobalFonts.registerFromPath(`build/structures/font/circularstd-black.otf`, "circular-std");
// canvas.GlobalFonts.registerFromPath(`build/structures/font/notosans-jp-black.ttf`, "noto-sans-jp");
// canvas.GlobalFonts.registerFromPath(`build/structures/font/notosans-black.ttf`, "noto-sans");
// canvas.GlobalFonts.registerFromPath(`build/structures/font/notoemoji-bold.ttf`, "noto-emoji");
// canvas.GlobalFonts.registerFromPath(`build/structures/font/notosans-kr-black.ttf`, "noto-sans-kr");

// Register fonts from package paths
canvas.GlobalFonts.registerFromPath(`node_modules/@codemaxxer69/astracard/build/structures/font/circularstd-black.otf`, "circular-std");
canvas.GlobalFonts.registerFromPath(`node_modules/@codemaxxer69/astracard/build/structures/font/notosans-jp-black.ttf`, "noto-sans-jp");
canvas.GlobalFonts.registerFromPath(`node_modules/@codemaxxer69/astracard/build/structures/font/notosans-black.ttf`, "noto-sans");
canvas.GlobalFonts.registerFromPath(`node_modules/@codemaxxer69/astracard/build/structures/font/notoemoji-bold.ttf`, "noto-emoji");
canvas.GlobalFonts.registerFromPath(`node_modules/@codemaxxer69/astracard/build/structures/font/notosans-kr-black.ttf`, "noto-sans-kr");
canvas.GlobalFonts.registerFromPath(`node_modules/musicard-bun/build/structures/font/Chewy-Regular.ttf`, "chewy");
canvas.GlobalFonts.registerFromPath(`node_modules/musicard-bun/build/structures/font/Space.ttf`, "space");


class AstraCard {
    constructor(options) {
        this.name = options?.name ?? null;
        this.author = options?.author ?? null;
        this.color = options?.color ?? null;
        this.theme = options?.theme ?? null;
        this.brightness = options?.brightness ?? null;
        this.thumbnail = options?.thumbnail ?? null;
        this.progress = options?.progress ?? null;
        this.starttime = options?.startTime ?? null;
        this.endtime = options?.endTime ?? null;
        this.requester = options?.requester ?? null
    }

    setName(name) {
        this.name = name;
        return this;
    }

    setAuthor(author) {
        this.author = author;
        return this;
    }

    setColor(color) {
        this.color = color;
        return this;
    }

    setTheme(theme) {
        this.theme = theme || 'theme1';
        return this;
    }

    setBrightness(brightness) {
        this.brightness = brightness;
        return this;
    }

    setThumbnail(thumbnail) {
        this.thumbnail = thumbnail;
        return this;
    }

    setProgress(progress) {
        this.progress = progress;
        return this;
    }

    setStartTime(starttime) {
        this.starttime = starttime;
        return this;
    }

    setEndTime(endtime) {
        this.endtime = endtime;
        return this;
    }

    setRequester(requester) {
        this.requester = `${requester}`;
        return this;
    }

    async build() {
        if (!this.name) throw new Error('Missing name parameter');
        if (!this.author) throw new Error('Missing author parameter');
        if (!this.requester) throw new Error('Missing requester parameter');
        if (!this.color) this.setColor('ff0000');
        if (!this.theme) this.setTheme('theme1');
        if (!this.brightness) this.setBrightness(0);
        if (!this.thumbnail) this.setThumbnail('https://clipart-library.com/images_k/superhero-transparent-background/superhero-transparent-background-8.png');
        if (!this.progress) this.setProgress(0);
        if (!this.starttime) this.setStartTime('0:00');
        if (!this.endtime) this.setEndTime('0:00');

        let validatedProgress = parseFloat(this.progress);
        if (Number.isNaN(validatedProgress) || validatedProgress < 0 || validatedProgress > 100) throw new Error('Invalid progress parameter, must be between 0 to 100');

        if (validatedProgress < 2) validatedProgress = 2;
        if (validatedProgress > 99) validatedProgress = 99;

        const validatedColor = await colorFetch(
            this.color || 'ff0000',
            parseInt(this.brightness) || 0,
            this.thumbnail
        );

        if (this.name.replace(/\s/g, '').length > 15) this.name = `${this.name.slice(0, 15)}...`;
        if (this.author.replace(/\s/g, '').length > 15) this.author = `${this.author.slice(0, 15)}`;
        if (this.requester.replace(/\s/g, '').length > 12) this.requester = `${this.requester.slice(0, 10)}...`;

        if (this.theme == 'theme1') {
            const progressBarWidth = (validatedProgress / 100) * 670;
            const circleX = progressBarWidth + 60;

            const circleCanvas = canvas.createCanvas(1000, 1000);
            const circleCtx = circleCanvas.getContext('2d');

            const circleRadius = 20;
            const circleY = 97;

            circleCtx.beginPath();
            circleCtx.arc(circleX, circleY, circleRadius, 0, 2 * Math.PI);
            circleCtx.fillStyle = `#${validatedColor}`;
            circleCtx.fill();

            const background = await canvas.loadImage(`https://i.etsystatic.com/34466454/r/il/5e9775/4175504808/il_1080xN.4175504808_bdhn.jpg`);

            const thumbnailCanvas = canvas.createCanvas(650, 650);
            const thumbnailCtx = thumbnailCanvas.getContext('2d');

            let thumbnailImage;

            try {
                thumbnailImage = await canvas.loadImage(this.thumbnail, {
                    requestOptions: {
                        headers: {
                            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/116.0.0.0 Safari/537.36',
                        }
                    }
                });
            } catch (error) {
                // Handle error when image cannot be loaded
                console.error('MUSICARD: Thumbnail image failed to load, not supported');
                thumbnailImage = await canvas.loadImage(`https://images.vexels.com/media/users/3/152580/isolated/preview/3149a30fc7f8585d67625a47b0f10916-orange-square-question-mark-icon.png`); // Use default image or alternative URL
            }
            const thumbnailSize = Math.min(thumbnailImage.width, thumbnailImage.height);
            const thumbnailX = (thumbnailImage.width - thumbnailSize) / 2;
            const thumbnailY = (thumbnailImage.height - thumbnailSize) / 2;

            const cornerRadius2 = 45;

            thumbnailCtx.beginPath();
            thumbnailCtx.moveTo(0 + cornerRadius2, 0);
            thumbnailCtx.arcTo(thumbnailCanvas.width, 0, thumbnailCanvas.width, thumbnailCanvas.height, cornerRadius2);
            thumbnailCtx.arcTo(thumbnailCanvas.width, thumbnailCanvas.height, 0, thumbnailCanvas.height, cornerRadius2);
            thumbnailCtx.arcTo(0, thumbnailCanvas.height, 0, 0, cornerRadius2);
            thumbnailCtx.arcTo(0, 0, thumbnailCanvas.width, 0, cornerRadius2);
            thumbnailCtx.closePath();
            thumbnailCtx.clip();

            thumbnailCtx.drawImage(thumbnailImage, thumbnailX, thumbnailY, thumbnailSize, thumbnailSize, 0, 0, thumbnailCanvas.width, thumbnailCanvas.height);

            const image = canvas.createCanvas(1280, 450);
            const ctx = image.getContext('2d');

            // Draw the background
            ctx.drawImage(background, 0, 0, 1280, 450);

            ctx.fillStyle = `#${validatedColor}`;
            ctx.font = `75px circular-std, noto-emoji, noto-sans-jp, noto-sans, noto-sans-kr`;
            ctx.fillText(this.name, 490, 180); 

            ctx.fillStyle = '#f40cb5';
            ctx.font = `55px circular-std, noto-emoji, noto-sans-jp, noto-sans, noto-sans-kr`;
            ctx.fillText(this.author, 510, 260); 

            ctx.fillStyle = '#0cf4bb';
            ctx.font = `50px circular-std, noto-emoji, noto-sans-jp, noto-sans, noto-sans-kr`;
            ctx.fillText(this.requester, 520, 330);

            ctx.drawImage(thumbnailCanvas, 70, 50, 350, 350);

            return image.toBuffer('image/png');
        } else if (this.theme === "theme2") {

            const progressBarWidth = (validatedProgress / 100) * 670;
            const circleX = progressBarWidth + 60;
            const image = canvas.createCanvas(1280, 350);
            const ctx = image.getContext('2d');
            const progressBarCanvas = canvas.createCanvas(670, 25);
            const progressBarCtx = progressBarCanvas.getContext('2d');
            const cornerRadius = 10;
            progressBarCtx.beginPath();
            progressBarCtx.moveTo(cornerRadius, 0);
            progressBarCtx.lineTo(670 - cornerRadius, 0);
            progressBarCtx.arc(670 - cornerRadius, cornerRadius, cornerRadius, 1.5 * Math.PI, 2 * Math.PI);
            progressBarCtx.lineTo(670, 25 - cornerRadius);
            progressBarCtx.arc(670 - cornerRadius, 25 - cornerRadius, cornerRadius, 0, 0.5 * Math.PI);
            progressBarCtx.lineTo(cornerRadius, 25);
            progressBarCtx.arc(cornerRadius, 25 - cornerRadius, cornerRadius, 0.5 * Math.PI, Math.PI);
            progressBarCtx.lineTo(0, cornerRadius);
            progressBarCtx.arc(cornerRadius, cornerRadius, cornerRadius, Math.PI, 1.5 * Math.PI);
            progressBarCtx.closePath();
            progressBarCtx.fillStyle = '#ababab';
            progressBarCtx.fill();
            progressBarCtx.beginPath();
            progressBarCtx.moveTo(cornerRadius, 0);
            progressBarCtx.lineTo(progressBarWidth - cornerRadius, 0);
            progressBarCtx.arc(progressBarWidth - cornerRadius, cornerRadius, cornerRadius, 1.5 * Math.PI, 2 * Math.PI);
            progressBarCtx.lineTo(progressBarWidth, 25);
            progressBarCtx.lineTo(cornerRadius, 25);
            progressBarCtx.arc(cornerRadius, 25 - cornerRadius, cornerRadius, 0.5 * Math.PI, Math.PI);
            progressBarCtx.lineTo(0, cornerRadius);
            progressBarCtx.arc(cornerRadius, cornerRadius, cornerRadius, Math.PI, 1.5 * Math.PI);
            progressBarCtx.closePath();
            progressBarCtx.fillStyle = `#${validatedColor}`;
            progressBarCtx.fill();

            const circleCanvas = canvas.createCanvas(1000, 1000);
            const circleCtx = circleCanvas.getContext('2d');

            const circleRadius = 20;
            const circleY = 97;

            circleCtx.beginPath();
            circleCtx.arc(circleX, circleY, circleRadius, 0, 2 * Math.PI);
            circleCtx.fillStyle = `#${validatedColor}`;
            circleCtx.fill();

            const background = await canvas.loadImage(`https://i.ibb.co/sVFTBNS/1.png`);

            const thumbnailCanvas = canvas.createCanvas(500, 500);
            const thumbnailCtx = thumbnailCanvas.getContext('2d');

            let thumbnailImage;

            try {
                thumbnailImage = await canvas.loadImage(this.thumbnail, {
                    requestOptions: {
                        headers: {
                            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/116.0.0.0 Safari/537.36',
                        }
                    }
                });
            } catch (error) {
               
                console.error('MUSICARD: Thumbnail image failed to load, not supported');
                thumbnailImage = await canvas.loadImage(`https://images.vexels.com/media/users/3/152580/isolated/preview/3149a30fc7f8585d67625a47b0f10916-orange-square-question-mark-icon.png`); 
            }

            const thumbnailSize = Math.min(thumbnailImage.width, thumbnailImage.height);
            const thumbnailX = (thumbnailImage.width - thumbnailSize) / 2;
            const thumbnailY = (thumbnailImage.height - thumbnailSize) / 2;

            const cornerRadius2 = 45;

            thumbnailCtx.beginPath();
            thumbnailCtx.moveTo(0 + cornerRadius2, 0);
            thumbnailCtx.arcTo(thumbnailCanvas.width, 0, thumbnailCanvas.width, thumbnailCanvas.height, cornerRadius2);
            thumbnailCtx.arcTo(thumbnailCanvas.width, thumbnailCanvas.height, 0, thumbnailCanvas.height, cornerRadius2);
            thumbnailCtx.arcTo(0, thumbnailCanvas.height, 0, 0, cornerRadius2);
            thumbnailCtx.arcTo(0, 0, thumbnailCanvas.width, 0, cornerRadius2);
            thumbnailCtx.closePath();
            thumbnailCtx.clip();

            thumbnailCtx.drawImage(thumbnailImage, thumbnailX, thumbnailY, thumbnailSize, thumbnailSize, 0, 0, thumbnailCanvas.width, thumbnailCanvas.height);

            const bg2 = await canvas.loadImage("https://i.ibb.co/wNzKvLg/2.png")

            // Draw the background
            ctx.drawImage(background, 0, 0, 1280, 350);
            ctx.drawImage(bg2, 0, 0, 1280, 350);

            // Apply fade effect between background and upper parts
            const gradient = ctx.createLinearGradient(0, 0, 0, 350);
            gradient.addColorStop(0, 'rgba(0,0,0,0.1)'); // Fully transparent
            gradient.addColorStop(0.5, 'rgba(0,0,0,0.1)'); // 50% transparent
            gradient.addColorStop(1, 'rgba(0,0,0,0.1)'); // Fully opaque

            ctx.fillStyle = gradient;
            ctx.fillRect(0, 0, 1280, 350);
            ctx.fillStyle = `#2d312f`;
            ctx.font = `60px circular-std, noto-emoji, noto-sans-jp, noto-sans, noto-sans-kr`;
            ctx.fillText(this.name, 430, 155); 

            ctx.fillStyle = '#341a54';
            ctx.font = `45px circular-std, noto-emoji, noto-sans-jp, noto-sans, noto-sans-kr`;
            ctx.fillText(this.author, 430, 210); 

            ctx.fillStyle = `#ffffff`;
            ctx.font = `35px circular-std, noto-emoji, noto-sans-jp, noto-sans, noto-sans-kr`;
            ctx.fillText("Request by " + this.requester, 430, 260);
            ctx.save();

            const thumbnailMaskCanvas = canvas.createCanvas(thumbnailCanvas.width, thumbnailCanvas.height);
            const thumbnailMaskCtx = thumbnailMaskCanvas.getContext('2d');
            const thumbnailMaskRadius = thumbnailCanvas.width / 2;
            
            thumbnailMaskCtx.beginPath();
            thumbnailMaskCtx.arc(thumbnailMaskRadius, thumbnailMaskRadius, thumbnailMaskRadius, 0, 2 * Math.PI);
            thumbnailMaskCtx.closePath();
            thumbnailMaskCtx.fillStyle = '#000'; // You can change the color to any color you prefer
            thumbnailMaskCtx.fill();
            
          
            thumbnailCtx.globalCompositeOperation = 'destination-in';
            thumbnailCtx.drawImage(thumbnailMaskCanvas, 0, 0);
            thumbnailCtx.globalCompositeOperation = 'source-over';
            ctx.drawImage(thumbnailCanvas, 80, 68, 250, 250);

            return image.toBuffer('image/png');
        }  else if (this.theme === "theme3") {

            const progressBarWidth = (validatedProgress / 100) * 670;
            const circleX = progressBarWidth + 60;
            const image = canvas.createCanvas(1280, 350);
            const ctx = image.getContext('2d');
            const progressBarCanvas = canvas.createCanvas(670, 25);
            const progressBarCtx = progressBarCanvas.getContext('2d');
            const cornerRadius = 10;
            progressBarCtx.beginPath();
            progressBarCtx.moveTo(cornerRadius, 0);
            progressBarCtx.lineTo(670 - cornerRadius, 0);
            progressBarCtx.arc(670 - cornerRadius, cornerRadius, cornerRadius, 1.5 * Math.PI, 2 * Math.PI);
            progressBarCtx.lineTo(670, 25 - cornerRadius);
            progressBarCtx.arc(670 - cornerRadius, 25 - cornerRadius, cornerRadius, 0, 0.5 * Math.PI);
            progressBarCtx.lineTo(cornerRadius, 25);
            progressBarCtx.arc(cornerRadius, 25 - cornerRadius, cornerRadius, 0.5 * Math.PI, Math.PI);
            progressBarCtx.lineTo(0, cornerRadius);
            progressBarCtx.arc(cornerRadius, cornerRadius, cornerRadius, Math.PI, 1.5 * Math.PI);
            progressBarCtx.closePath();
            progressBarCtx.fillStyle = '#ababab';
            progressBarCtx.fill();
            progressBarCtx.beginPath();
            progressBarCtx.moveTo(cornerRadius, 0);
            progressBarCtx.lineTo(progressBarWidth - cornerRadius, 0);
            progressBarCtx.arc(progressBarWidth - cornerRadius, cornerRadius, cornerRadius, 1.5 * Math.PI, 2 * Math.PI);
            progressBarCtx.lineTo(progressBarWidth, 25);
            progressBarCtx.lineTo(cornerRadius, 25);
            progressBarCtx.arc(cornerRadius, 25 - cornerRadius, cornerRadius, 0.5 * Math.PI, Math.PI);
            progressBarCtx.lineTo(0, cornerRadius);
            progressBarCtx.arc(cornerRadius, cornerRadius, cornerRadius, Math.PI, 1.5 * Math.PI);
            progressBarCtx.closePath();
            progressBarCtx.fillStyle = `#${validatedColor}`;
            progressBarCtx.fill();

            const circleCanvas = canvas.createCanvas(1000, 1000);
            const circleCtx = circleCanvas.getContext('2d');

            const circleRadius = 20;
            const circleY = 97;

            circleCtx.beginPath();
            circleCtx.arc(circleX, circleY, circleRadius, 0, 2 * Math.PI);
            circleCtx.fillStyle = `#${validatedColor}`;
            circleCtx.fill();

            const background = await canvas.loadImage(`https://i.ibb.co/x85CQqx/1-1.png`);

            const thumbnailCanvas = canvas.createCanvas(500, 500);
            const thumbnailCtx = thumbnailCanvas.getContext('2d');

            let thumbnailImage;

            try {
                thumbnailImage = await canvas.loadImage(this.thumbnail, {
                    requestOptions: {
                        headers: {
                            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/116.0.0.0 Safari/537.36',
                        }
                    }
                });
            } catch (error) {
                // Mengatasi kesalahan ketika gambar tidak dapat dimuat
                console.error('MUSICARD: Thumbnail image failed to load, not supported');
                thumbnailImage = await canvas.loadImage(`https://images.vexels.com/media/users/3/152580/isolated/preview/3149a30fc7f8585d67625a47b0f10916-orange-square-question-mark-icon.png`); // Gunakan gambar default atau URL alternatif
            }

            const thumbnailSize = Math.min(thumbnailImage.width, thumbnailImage.height);
            const thumbnailX = (thumbnailImage.width - thumbnailSize) / 2;
            const thumbnailY = (thumbnailImage.height - thumbnailSize) / 2;

            const cornerRadius2 = 45;

            thumbnailCtx.beginPath();
            thumbnailCtx.moveTo(0 + cornerRadius2, 0);
            thumbnailCtx.arcTo(thumbnailCanvas.width, 0, thumbnailCanvas.width, thumbnailCanvas.height, cornerRadius2);
            thumbnailCtx.arcTo(thumbnailCanvas.width, thumbnailCanvas.height, 0, thumbnailCanvas.height, cornerRadius2);
            thumbnailCtx.arcTo(0, thumbnailCanvas.height, 0, 0, cornerRadius2);
            thumbnailCtx.arcTo(0, 0, thumbnailCanvas.width, 0, cornerRadius2);
            thumbnailCtx.closePath();
            thumbnailCtx.clip();

            thumbnailCtx.drawImage(thumbnailImage, thumbnailX, thumbnailY, thumbnailSize, thumbnailSize, 0, 0, thumbnailCanvas.width, thumbnailCanvas.height);

            const bg2 = await canvas.loadImage("https://i.ibb.co/wNzKvLg/2.png")

            // Draw the background
            ctx.drawImage(background, 0, 0, 1280, 350);
            ctx.drawImage(bg2, 0, 0, 1280, 350);

            // Apply fade effect between background and upper parts
            const gradient = ctx.createLinearGradient(0, 0, 0, 350);
            gradient.addColorStop(0, 'rgba(0,0,0,0.1)'); // Fully transparent
            gradient.addColorStop(0.5, 'rgba(0,0,0,0.1)'); // 50% transparent
            gradient.addColorStop(1, 'rgba(0,0,0,0.1)'); // Fully opaque

            ctx.fillStyle = gradient;
            ctx.fillRect(0, 0, 1280, 350);
            ctx.fillStyle = `#f2d7b7`;
            ctx.font = `60px circular-std, noto-emoji, noto-sans-jp, noto-sans, noto-sans-kr`;
            ctx.fillText(this.name, 430, 155); 

            ctx.fillStyle = '#fcfcfc';
            ctx.font = `45px circular-std, noto-emoji, noto-sans-jp, noto-sans, noto-sans-kr`;
            ctx.fillText(this.author, 430, 220); 

            ctx.fillStyle = `#f2d7b7`;
            ctx.font = `35px circular-std, noto-emoji, noto-sans-jp, noto-sans, noto-sans-kr`;
            ctx.fillText("Request by " + this.requester, 430, 270);
            ctx.save();

            const thumbnailMaskCanvas = canvas.createCanvas(thumbnailCanvas.width, thumbnailCanvas.height);
            const thumbnailMaskCtx = thumbnailMaskCanvas.getContext('2d');
            const thumbnailMaskRadius = thumbnailCanvas.width / 2;
            
            thumbnailMaskCtx.beginPath();
            thumbnailMaskCtx.arc(thumbnailMaskRadius, thumbnailMaskRadius, thumbnailMaskRadius, 0, 2 * Math.PI);
            thumbnailMaskCtx.closePath();
            thumbnailMaskCtx.fillStyle = '#000'; 
            thumbnailMaskCtx.fill();
            
          
            thumbnailCtx.globalCompositeOperation = 'destination-in';
            thumbnailCtx.drawImage(thumbnailMaskCanvas, 0, 0);
            thumbnailCtx.globalCompositeOperation = 'source-over';
            ctx.drawImage(thumbnailCanvas, 80, 68, 250, 250);

            return image.toBuffer('image/png');

        }  else if (this.theme === "theme4") {
                const frame = canvas.createCanvas(800, 200);
                const ctx = frame.getContext("2d");
    
                const circleCanvas = canvas.createCanvas(1000, 1000);
                const circleCtx = circleCanvas.getContext('2d');
    
                const circleRadius = 20;
                const circleY = 97;
    
               
                const imageUrls = [
                    "https://i.ibb.co/sVFTBNS/1.png",
                ];
    
               
                function getRandomImageUrl() {
                    const randomIndex = Math.floor(Math.random() * imageUrls.length);
                    return imageUrls[randomIndex];
                }
    
                const backgroundUrl = getRandomImageUrl();
                const background = await canvas.loadImage(backgroundUrl);
                ctx.drawImage(background, 0, 0, frame.width, frame.height);
    
                const thumbnailCanvas = canvas.createCanvas(800, 200); 
                const thumbnailCtx = thumbnailCanvas.getContext('2d');
    
                let thumbnailImage;
    
                try {
                    thumbnailImage = await canvas.loadImage(this.thumbnail, {
                        requestOptions: {
                            headers: {
                                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/116.0.0.0 Safari/537.36',
                            }
                        }
                    });
                } catch (error) {
                   
                    console.error('MUSICARD: Thumbnail image failed to load, not supported [Lofi & Radio]');
                    thumbnailImage = await canvas.loadImage(`https://i.ibb.co/1r3CBLd/thumbnail.png`);
                }
    
                const thumbnailSize = Math.min(thumbnailImage.width, thumbnailImage.height);
                const thumbnailX = (thumbnailImage.width - thumbnailSize) / 2;
                const thumbnailY = (thumbnailImage.height - thumbnailSize) / 2;
    
    
    
                thumbnailCtx.drawImage(thumbnailImage, thumbnailX, thumbnailY, thumbnailSize, thumbnailSize, 0, 0, thumbnailCanvas.width, thumbnailCanvas.height);
    
    
                
                ctx.drawImage(thumbnailCanvas, 50, 40, 180, 130);
    
                ctx.strokeStyle = '#ffffff'; 
                ctx.lineWidth = 5; 
                ctx.strokeRect(50, 40, 180, 130); 
    
    
                
                const allowedColors = ['#ffffff'];
    
              
                function getRandomColor() {
                    return allowedColors[Math.floor(Math.random() * allowedColors.length)];
                }
    
                
                ctx.font = "bold 50px circular-std, noto-emoji, noto-sans-jp, noto-sans, noto-sans-kr";
                ctx.fillStyle = getRandomColor(); 
                ctx.fillText(this.name, 250, 100);
    
              
                const authorText = this.author;
                ctx.fillStyle = getRandomColor(); 
                ctx.font = "bold 28px circular-std, noto-emoji, noto-sans-jp, noto-sans, noto-sans-kr";
                ctx.fillText(authorText, 250, 140);
    
                const authorTextWidth = ctx.measureText(authorText).width;
    
               
                const requesterText = `• ${this.requester}`;
                ctx.fillStyle = getRandomColor(); 
                ctx.font = "bold 28px circular-std, noto-emoji, noto-sans-jp, noto-sans, noto-sans-kr";
                ctx.fillText(requesterText, 250 + authorTextWidth + 10, 140); 
    
                return frame.toBuffer("image/png");
            } else {
            throw new Error('Invalid theme, must be "theme1" | "theme2" | "theme3" | "theme4"');
        }
    }
}

module.exports = { AstraCard };
