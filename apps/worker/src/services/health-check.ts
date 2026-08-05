export async function pollHealthCheck(url: string, maxAttempts = 30): Promise<boolean> {
  let attempt = 0;
  let delay = 1000;
  
  while (attempt < maxAttempts) {
    try {
      const res = await fetch(url);
      if (res.ok) {
        return true;
      }
    } catch (e) {
      // Not ready yet
    }
    
    await new Promise(resolve => setTimeout(resolve, delay));
    attempt++;
    // Exponential backoff, max 5 seconds
    delay = Math.min(delay * 1.5, 5000);
  }
  
  return false;
}
