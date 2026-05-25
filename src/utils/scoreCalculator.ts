export const calculateFinalScore = (cpuTier: number, gpuTier: number, ramMult: number) => {
  const rawScore = (gpuTier * 0.6) + (cpuTier * 0.3) + (ramMult * 10 * 0.1);
  return parseFloat(rawScore.toFixed(1));
};

export const detectBottleneck = (cpuTier: number, gpuTier: number, ramId: string) => {
  let warnings = [];

  // 1. CPU Bottleneck (GPU is much stronger than CPU)
  if (gpuTier - cpuTier >= 3) {
    warnings.push("⚠️ CPU Bottleneck: Your processor is too weak for this high-end GPU. Expect frame drops.");
  }

  // 2. GPU Bottleneck (CPU is much stronger than GPU - common in budget builds)
  if (cpuTier - gpuTier >= 4) {
    warnings.push("⚠️ GPU Bottleneck: Your CPU is overkill for this graphics card. Upgrade your GPU for better gaming.");
  }

  // 3. RAM Bottleneck
  if (ramId === 'r1' && gpuTier >= 6) { // 8GB RAM with a mid/high-end GPU
    warnings.push("⚠️ RAM Bottleneck: 8GB of memory will severely limit this system in modern titles. Upgrade to at least 16GB.");
  }

  return warnings;
};