export async function getSolanaPrice() {
  let response = await fetch(
    "https://api.diadata.org/v1/assetQuotation/Solana/0x0000000000000000000000000000000000000000"
  );
  let data = await response.json();
  return data;
}
