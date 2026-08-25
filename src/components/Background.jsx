import React, { useEffect, useRef } from "react"

const AnimatedBackground = () => {
	const blobRefs = useRef([])
	const initialPositions = [
		{ x: -4, y: 0 },
		{ x: -4, y: 0 },
		{ x: 20, y: -8 },
		{ x: 20, y: -8 },
	]

	useEffect(() => {
		let currentScroll = 0
		let requestId

		const handleScroll = () => {
			const newScroll = window.pageYOffset
			const scrollDelta = newScroll - currentScroll
			currentScroll = newScroll

			blobRefs.current.forEach((blob, index) => {
				const initialPos = initialPositions[index]

				// Calculating movement in both X and Y direction
				const xOffset = Math.sin(newScroll / 100 + index * 0.5) * 340 // Horizontal movement
				const yOffset = Math.cos(newScroll / 100 + index * 0.5) * 40 // Vertical movement

				const x = initialPos.x + xOffset
				const y = initialPos.y + yOffset

				// Apply transformation with smooth transition
				blob.style.transform = `translate(${x}px, ${y}px)`
				blob.style.transition = "transform 1.4s ease-out"
			})

			requestId = requestAnimationFrame(handleScroll)
		}

		window.addEventListener("scroll", handleScroll)
		return () => {
			window.removeEventListener("scroll", handleScroll)
			cancelAnimationFrame(requestId)
		}
	}, [])

	return (
		<div className="fixed inset-0 ">
			<div className="absolute inset-0">
				<div
					ref={(ref) => (blobRefs.current[0] = ref)}
					className="absolute top-0 -left-4 md:w-96 md:h-96 w-72 h-72 bg-red-600 rounded-full mix-blend-multiply filter blur-[128px] opacity-40 md:opacity-20 "></div>
				<div
					ref={(ref) => (blobRefs.current[1] = ref)}
					className="absolute top-0 -right-4 w-96 h-96 bg-blue-600 rounded-full mix-blend-multiply filter blur-[128px] opacity-40 md:opacity-20 hidden sm:block"></div>
				<div
					ref={(ref) => (blobRefs.current[2] = ref)}
					className="absolute -bottom-8 left-[-40%] md:left-20 w-96 h-96 bg-red-700 rounded-full mix-blend-multiply filter blur-[128px] opacity-40 md:opacity-20 "></div>
					<div
					ref={(ref) => (blobRefs.current[3] = ref)}
					className="absolute -bottom-10 right-20 w-96 h-96 bg-blue-700 rounded-full mix-blend-multiply filter blur-[128px] opacity-20 md:opacity-10 hidden sm:block"></div>
			</div>
			{/* Spider-web line grid, subtle */}
			<div className="absolute inset-0 bg-[linear-gradient(to_right,#dc262610_1px,transparent_1px),linear-gradient(to_bottom,#dc262610_1px,transparent_1px)] bg-[size:24px_24px]"></div>
			{/* Corner web motifs */}
			<svg className="absolute -top-10 -left-10 w-64 h-64 opacity-[0.08] pointer-events-none" viewBox="0 0 200 200" fill="none" stroke="#dc2626" strokeWidth="1.5">
				{[...Array(7)].map((_, i) => (
					<line key={`r-${i}`} x1="0" y1="0" x2={200 * Math.cos((i * Math.PI) / 12)} y2={200 * Math.sin((i * Math.PI) / 12)} />
				))}
				{[20, 45, 75, 110, 150, 195].map((r, i) => (
					<path key={`a-${i}`} d={`M ${r} 0 A ${r} ${r} 0 0 1 0 ${r}`} />
				))}
			</svg>
			<svg className="absolute -bottom-10 -right-10 w-64 h-64 opacity-[0.08] rotate-180 pointer-events-none" viewBox="0 0 200 200" fill="none" stroke="#2563eb" strokeWidth="1.5">
				{[...Array(7)].map((_, i) => (
					<line key={`r2-${i}`} x1="0" y1="0" x2={200 * Math.cos((i * Math.PI) / 12)} y2={200 * Math.sin((i * Math.PI) / 12)} />
				))}
				{[20, 45, 75, 110, 150, 195].map((r, i) => (
					<path key={`a2-${i}`} d={`M ${r} 0 A ${r} ${r} 0 0 1 0 ${r}`} />
				))}
			</svg>
		</div>
	)
}

export default AnimatedBackground

