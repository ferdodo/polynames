import { html } from "htm/preact";
import { useEffect, useState } from "preact/hooks";
import { useGame } from "../hooks";
import { computePoints } from "../utils";

export function Points() {
	const [previousPoints, setPreviousPoints] = useState(0);
	const [mouseX, setMouseX] = useState(0);
	const [mouseY, setMouseY] = useState(0);
	const [x, setX] = useState(0);
	const [y, setY] = useState(0);
	const [displayedPoints, setDisplayedPoints] = useState(0);

	const { rounds } = useGame();

	useEffect(() => {
		const points = computePoints(rounds);
		const pointDiff = points - previousPoints;

		if (pointDiff) {
			setPreviousPoints(points);
			setDisplayedPoints(pointDiff);
			setX(mouseX);
			setY(mouseY);
		}
	}, [rounds, previousPoints, mouseX, mouseY]);

	useEffect(() => {
		const handleMouseMove = (event: MouseEvent) => {
			setMouseX(event.clientX);
			setMouseY(event.clientY);
		};

		window.addEventListener("mousemove", handleMouseMove);

		return () => {
			window.removeEventListener("mousemove", handleMouseMove);
		};
	}, []);

	return html`
		<polynames-point x=${x} y=${y}>
            +${displayedPoints} Pt
		</polynames-point>
	`;
}
