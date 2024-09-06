export const getNFTs = async (walletAddress) => {
  const apiKey = "RaAMH-kVgu5VI7Zq"; // Thay thế bằng API key của bạn

  const myHeaders = new Headers();
  myHeaders.append("x-api-key", apiKey);


  const url = `https://api.shyft.to/sol/v2/nft/compressed/read_all?network=devnet&wallet_address=${walletAddress}`;

  try {
    const response = await fetch(url, {
      method: "GET",
      headers: myHeaders,
      redirect: "follow",
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const result = await response.json();
    console.log("NFTs: ", result.result.nfts);

    return result.result.nfts;
  } catch (error) {
    console.log("error", error);
    return null;
  }
};
