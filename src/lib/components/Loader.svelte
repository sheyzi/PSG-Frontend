<div
	class="w-scree absolute left-0 top-0 z-[9000] flex h-screen min-h-full min-w-full items-center justify-center bg-black/90 backdrop-blur-sm"
>
	<div class="flex gap-2">
		<div class="ball-container h-[10px] w-[10px] rounded-full bg-primary-main-green"></div>
		<div class="ball-container h-[10px] w-[10px] rounded-full bg-primary-main-yellow"></div>
		<div class="ball-container h-[10px] w-[10px] rounded-full bg-primary-main-blue"></div>
	</div>
</div>

<style>
	.ball-container {
		animation: bounce 1s infinite alternate;
	}
	.ball-container:nth-child(2) {
		animation-delay: 400ms;
	}
	.ball-container:nth-child(3) {
		animation-delay: 650ms;
	}
	@keyframes bounce {
		from {
			transform: translateY(0);
		}
		to {
			transform: translateY(15px);
		}
	}
</style>
