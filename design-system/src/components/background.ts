import htm from "htm/mini";
import h from "hyperscript";
import { createTemplate, getShadowRoot } from "../utils";

const html = htm.bind(h);
const tagName = "polynames-background";

declare global {
	export namespace JSX {
		export interface IntrinsicElements {
			[tagName]: undefined;
		}
	}
}

const template = createTemplate(html`
	<style>

/* DEFAULT VALUES */

*,
*::before,
*::after {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

nav {
  user-select:none;
  -webkit-user-select:none;
  -moz-user-select:none;
  -ms-user-select:none;
  -o-user-select:none;
}

nav > ul,
nav > ul > li {
  outline: 0;
}

nav > ul > li > a {
 text-decoration: none;
}

.body {
  height: 100%;
  min-height: 100vh;
  background: linear-gradient(90deg, #aea4e3, #d3ffe8);
}

/* MAIN MENU */

.main-menu {
  position:fixed;
  top: 0;
  left: 0;
  height: 100%;
  width: 60px;
  overflow:hidden;
  background: #0009;
  transition: width .05s linear;
  -webkit-transition: width .05s linear;
  padding-top: 0.7vw;
}

.main-menu:hover {
  width: 180px;
  overflow:visible;
}

.main-menu > ul > li {
  position: relative;
  display: block;
  width: 180px;
}

.main-menu > ul > li > a {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  color:#999;
  font-size: 1rem;
  transition: all 0.1s linear;
  -webkit-transition: all 0.1s linear;
  padding: 0.7vw 0;
}

.nav-icon {
  width: 60px;
  height: 20px;
  font-size: 20px;
  text-align: center;
}

.nav-text {
  width: 120px;
  height: 20px;
  font-family: "Mulish", sans-serif;
}

.logout {
  position: absolute;
  left: 0;
  bottom: 0;
}

.main-menu li:hover > a, .main-menu li.active > a, .main-menu li > a:focus {
  text-decoration: none;
  color: #fff;
  background-color: rgb(29, 79, 215, 0.7);
}

/* ANIMATED BACKGROUND */

.container {
	background:#1F2024;
	height: 100%;
	overflow: hidden;
	position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
}

.blob-c {
	min-height: 100vh;
	overflow: hidden;
	position:absolute;
	width: 100%;
	filter: blur(3.8vw);
/*   background: rgba(255,255,255,0.1) */
}

.blob {
	background:#26C3F9;
	height: 4.2vw;
	width: 5.6vw;
	border-radius: 40% 50% 30% 40%;
  animation: transform 18s ease-in-out infinite both alternate, movement_one 12s ease-in-out infinite both;
	opacity:.7;
	position: absolute;
	left: 75%;
	top: 40%;
}

.blob.one{
	background:#0085FF;
	height: 10.4vw;
	width: 13.9vw;
	left: 0.7vw;
	top: 0.7vw;
	transform: rotate(-180deg);
	animation: transform 8s ease-in-out infinite both alternate, movement_two 20s ease-in-out infinite both;
}

.blob.two{
	background:#4EAEFF;
	height: 10.4vw;
	width: 10.4vw;
	left: 41.7vw;
	top: 17.4vw;
	transform: rotate(-180deg);
	animation: transform 10s ease-in-out infinite both alternate, movement_two 10s ease-in-out infinite both;
}

.blob.three{
	background:#0EAFFF;
	height: 10.4vw;
	width: 10.4vw;
	left: 55.6vw;
	top: 2.1vw;
	transform: rotate(-180deg);
	animation: transform 7s ease-in-out infinite both alternate, movement_two 23s ease-in-out infinite both;
}

.blob.four{
	background:#4EAEFF;
	height: 6.9vw;
	width: 6.9vw;
	left: 34.7vw;
	top: 4.2vw;
	transform: rotate(-180deg);
	animation: transform 17s ease-in-out infinite both alternate, movement_two 12s ease-in-out infinite both;
}

.blob.five{
	background:#0085FF;
	height: 6.9vw;
	width: 5.6vw;
	left: 33.3vw;
	top: 17.4vw;
	transform: rotate(-180deg);
	animation: transform 12s ease-in-out infinite both alternate, movement_two 18s ease-in-out infinite both;
}

.blob.six{
	background:#0EAFFF;
	height: 4.9vw;
	width: 6.9vw;
	left: 11.1vw;
	top: 27.8vw;
	transform: rotate(-180deg);
	animation: transform 5s ease-in-out infinite both alternate, movement_two 7s ease-in-out infinite both;
}

.blob.seven{
	background: #0085FF;
	height: 4.9vw;
	width: 6.9vw;
	left: 27.8vw;
	top: 27.8vw;
	transform: rotate(-180deg);
	animation: transform 5s ease-in-out infinite both alternate, movement_two 12s ease-in-out infinite both;
}

.blob.height{
  height: 5.6vw;
  width: 10vw;
  left: 55.6vw;
  top: 55.6vw;
  transform: rotate(-180deg);
  animation: transform 5s ease-in-out infinite both alternate, movement_one 12s ease-in-out infinite both;
}

.blob.nine {
  background: #0EAFFF;
  height: 5.6vw;
  width: 2vw;
  left: 42.6vw;
  top: 64.6vw;
  transform: rotate(-180deg);
  animation: transform 7s ease-in-out infinite both alternate, movement_two 15s ease-in-out infinite both;

}

@keyframes transform
{
    0%,
  100% { border-radius: 33% 67% 70% 30% / 30% 40% 70% 70%; } 
   20% { border-radius: 37% 63% 51% 49% / 37% 35% 35% 63%; } 
   40% { border-radius: 36% 64% 64% 36% / 64% 48% 52% 26%; } 
   60% { border-radius: 37% 63% 51% 49% / 30% 30% 70% 73%; } 
   80% { border-radius: 40% 60% 42% 58% / 51% 51% 49% 59%; } 
}

@keyframes movement_one
{
    0%,
  100% { transform: none; }
   50% { transform: translate(50%, 20%) rotateY(10deg) scale(1); }
}

@keyframes movement_two
{
    0%,
  500% { transform: none; }
   50% { transform: translate(50%, 100%) rotate(-200deg) scale(1.3);}
}


/* CARD */

section {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 2.1vw;
  padding: 80px 40px 40px 80px;
}

.card {
  width: min(100%, 500px);
  background: rgba(255, 255, 255);
  border-radius: 16px;
  font-family: "Poppins", sans-serif;
}

.card > img {
  display: block;
  width: 100%;
  max-width: 500px;
  aspect-ratio: 4/3;
  object-fit: cover;
  object-position: 50% 50%;
  border-radius: 16px 16px 0 0;
  filter: contrast(70%);
  transition: all 0.6s cubic-bezier(0.43, 0.41, 0.22, 0.91);
}

.card > img:hover {
  filter: contrast(100%);
}

.card-content {
  display: flex;
  flex-direction: column;
  padding: 20px 15px 20px;
}

.card-content > p {
  margin-bottom: 0.7vw;
}

.card-content > p:nth-child(1) {
  font-size: 1rem;
  font-weight: 600;
  margin-bottom: 0.7vw;
  color: #1e40af;
}

.card-content > p:nth-child(2) {
  font-size: 0.8rem;
  font-weight: 400;
  color: #6b7280;
}

@media (max-width: 900px) {
  section {
     grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 500px) {
  section {
     grid-template-columns: repeat(1, 1fr);
  }
}
	</style>

	<div className="body">
		<div className="container">
			<div className="blob-c">
			<div className="blob"></div>
			<div className="blob one"></div>
			<div className="blob two"></div>
			<div className="blob three"></div>
			<div className="blob four"></div>
			<div className="blob five"></div>
			<div className="blob six"></div>
			<div className="blob seven"></div>
      <div className="blob height"></div>
      <div className="blob nine"></div>
		</div>
	</div>
</div>
`);

class Background extends HTMLElement {
	constructor() {
		super();
		this.attachShadow({ mode: "open" });
		const shadowRoot = getShadowRoot(this);
		const clonedTemplate = template.content.cloneNode(true);
		shadowRoot.appendChild(clonedTemplate);
	}
}

customElements.define(tagName, Background);
