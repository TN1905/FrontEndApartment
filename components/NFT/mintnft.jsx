import React, {useState,useEffect,useContext,useRef} from "react";
import { toast } from "react-toastify";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { ExternalLinkIcon } from "@heroicons/react/outline";
import { useRouter } from "next/router";
import { HouseContext } from "../Apartment/HouseContext";
import { getWallet } from "../../api/wallet/getWallet";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { signIn } from "next-auth/react";
import {getNftByAccount} from "../../api/mintnft/getNftByAccount";
const image = {
  bronze:
    "https://res.cloudinary.com/drpmyxvdz/image/upload/v1723704971/openart-image_F-OeVy1u_1723704725587_raw_nbjes4.jpg",
  silver:
    "https://res.cloudinary.com/drpmyxvdz/image/upload/v1723704971/openart-image_6ZxV-cIq_1723704783008_raw_soau9b.jpg",
  gold: "https://res.cloudinary.com/drpmyxvdz/image/upload/v1723704971/openart-image_pL8r0N5i_1723704839666_raw_jtg5hp.jpg",
  platinum:
    "https://res.cloudinary.com/drpmyxvdz/image/upload/v1723704970/openart-image_N1bIsb3L_1723704876345_raw_kkcffh.jpg",
  diamond:
    "https://res.cloudinary.com/drpmyxvdz/image/upload/v1723704971/openart-image_yFUUdJH8_1723704917358_raw_un7k1e.jpg",
};
  
const nftExternalUrl =
  "https://console.cloudinary.com/console/c-5aa6393b29a5bf81b1ab488d8bdd48/media_library/search?q=&view_mode=mosaic";

const MintNFT = () => {
  const [apiUrl, setApiUrl] = useState("");
  const [nft, setNft] = useState("");
  const [nftImage, setNftImage] = useState("");
  const [nftImageUrl,setNftImageUrl] = useState("");
  const [nftTitle,setNftTitle] = useState("");
  const [nftDescription,setNftDescription] = useState("");
  const {user} = useContext(HouseContext);
  const [mintCompressId, setMintCompressId] = useState("");
  const [name,setName] = useState("");
  const [description,setDescription] = useState("");
  const [traitType,setTraitType] = useState("");
  const [value,setValue] = useState("");

  useEffect(() => {
    const initiate = async () => {
      const mintNftInfo = await getNftByAccount(user.id); // Đảm bảo rằng bạn đang chờ đợi dữ liệu từ API
      if (mintNftInfo) {
        console.log(mintNftInfo.type_nft)
        console.log(mintNftInfo);
        if (mintNftInfo[0].type_nft === "DIAMOND") {
          setNftTitle("MINT DIAMOND NFT");
          setNftDescription(
            "Mint your diamond nft will discount 20% when you rent apartment"
          );
          setNftImageUrl(image.diamond);
          setMintCompressId("easy-rent-apartment-diamond");
          setName("Easy Rent Apartment Diamond");
          setDescription("Easy Rent Apartment NFT Diamond");
          setTraitType("Apartment NFT Diamond");
          setValue("NFT Diamond");
        } else if (mintNftInfo[0].type_nft === "PLATINUM") {
          console.log("????");
          setNftTitle("MINT PLATINUM NFT");
          setNftDescription(
            "Mint your platinum nft will discount 20% when you rent apartment"
          );
          setNftImageUrl(image.platinum);
          setMintCompressId("easy-rent-apartment-platinum");
          setName("Easy Rent Apartment Platinum");
          setDescription("Easy Rent Apartment NFT Platinum");
          setTraitType("Apartment NFT Platinum");
          setValue("NFT Platinum");
        } else if (mintNftInfo[0].type_nft === "GOLD") {
          setNftTitle("MINT GOLD NFT");
          setNftDescription(
            "Mint your gold nft will discount 20% when you rent apartment"
          );
          setNftImageUrl(image.gold);
          setMintCompressId("easy-rent-apartment-gold");
          setName("Easy Rent Apartment Gold");
          setDescription("Easy Rent Apartment NFT Gold");
          setTraitType("Apartment NFT Gold");
          setValue("NFT Gold");
        } else if (mintNftInfo[0].type_nft === "SILVER") {
          setNftTitle("MINT SILVER NFT");
          setNftDescription(
            "Mint your silver nft will discount 20% when you rent apartment"
          );
          setNftImageUrl(image.silver);
          setMintCompressId("easy-rent-apartment-silver");
          setName("Easy Rent Apartment Silver");
          setDescription("Easy Rent Apartment NFT Silver");
          setTraitType("Apartment NFT Silver");
          setValue("NFT Silver");
        } else if (mintNftInfo[0].type_nft === "BRONZE") {
          setNftTitle("MINT BRONZE NFT");
          setNftDescription(
            "Mint your bronze nft will discount 20% when you rent apartment"
          );
          setNftImageUrl(image.bronze);
          setMintCompressId("easy-rent-apartment-bronze");
          setName("Easy Rent Apartment Bronze");
          setDescription("Easy Rent Apartment NFT Bronze");
          setTraitType("Apartment NFT Bronze");
          setValue("NFT Bronze");
        }
      }
    };

    initiate(); // Đừng quên gọi hàm initiate để nó chạy
  }, [user.id]);
  
  //get user info from wallet provider
  const { connection } = useConnection();
  const { publicKey } = useWallet();

  //create compressed nft
  const mintCompressedNft = async (event) => {
    //prevent react app from resetting
    event.preventDefault();

    //make api call to create NFT
    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        jsonrpc: "2.0",
        id: mintCompressId,
        method: "mintCompressedNft",
        params: {
          name: name,
          symbol: "NNFT",
          owner: publicKey,
          description: description,
          attributes: [
            {
              trait_type: traitType,
              value: value,
            },
          ],
          imageUrl: nftImageUrl,
          externalUrl: nftExternalUrl,
          sellerFeeBasisPoints: 6900,
        },
      }),
    });

    const { result } = await response.json();
    console.log("RESULT", result);

    if (!result) {
      toast.error("Request failed");
      throw "Request Failed";
    }

    setNft(result.assetId);

    fetchNFT(result.assetId, event);
  };

  //fetch nft affer it's minted
  const fetchNFT = async (
    assetId,
    event
  ) => {
    // prevent app from reloading
    event.preventDefault();

    try {
      // Make API call to fetch NFT
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          jsonrpc: "2.0",
          id: "my-id",
          method: "getAsset",
          params: {
            id: assetId,
          },
        }),
      });

      // Extrapolate API response
      const { result } = await response.json();
      console.log("Fetched NFT", result);

      // Set NFT image in state variable
      setNftImage(result.content.links.image);

      return { result };
    } catch (error) {
      console.error("Error fetching NFT:", error);
      toast.error("Failed to fetch NFT");
    }
  };

  // display function outputs to ui
  const outputs = [
    {
      title: "Asset ID...",
      dependency: nft,
      href: `https://xray.helius.xyz/token/${nft}?network=devnet`,
    },
  ];

  // set api url onload
  React.useEffect(() => {
    setApiUrl(
      connection.rpcEndpoint.includes("devnet")
        ? "https://devnet.helius-rpc.com/?api-key=23aabe59-1cbe-4b31-91da-0ae23a590bdc"
        : "https://mainet.helius-rpc.com/?api-key=23aabe59-1cbe-4b31-91da-0ae23a590bdc"
    );
  }, [connection]);

  return (
    <>
      <div className="w-full">
        <section className="w-full bg-gradient-to-r from-[#5B21B6] to-[#7C3AED] py-24 md:py-32 lg:py-40">
          <div className="container mx-auto px-4 md:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 lg:gap-16">
              <div className="flex flex-col items-start justify-center space-y-6 md:space-y-8 lg:space-y-10">
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white">
                  {nftTitle}
                </h1>
                <p className="text-lg md:text-xl lg:text-2xl text-white">
                  {nftDescription}
                </p>
                <form
                  className="w-full space-y-4"
                  onSubmit={(event) => mintCompressedNft(event)}
                >
                  <div className="flex w-[320px] justify-between">
                    <WalletMultiButton className="!bg-helius-orange hover:!bg-black transition-all duration-200 !rounded-lg" />
                    <button
                      type="submit"
                      className="inline-flex items-center justify-center px-6 py-3 border border-transparent 
                      text-base font-medium rounded-md shadow-sm text-white bg-[#7C3AED] hover:bg-[#6D28D9] 
                      focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#6D28D9]"
                      disabled={!publicKey || !connection}
                    >
                      Mint NFT
                    </button>
                  </div>
                </form>
              </div>
              <div className="relative h-64 md:h-80 lg:h-96 overflow-hidden rounded-xl">
                <img
                  src={nftImageUrl}
                  alt="NFT Artwork"
                  layout="fill"
                  objectFit="cover"
                  className="w-full h-full"
                />
              </div>
            </div>
          </div>
        </section>
      </div>
      {/* <main className="max-w-7xl grid grid-cols-1 sm:grid-cols-6 gap-4 p-4 text-white">
        <form
          onSubmit={(event) => mintCompressedNft(event)}
          className="rounded-lg min-h-content bg-[#2a302f] p-4 sm:col-span-6 lg:col-start-2 lg:col-end-6"
        >
          <div className="flex justify-between items-center">
            <h2 className="text-lg sm:text-2xl font-semibold">
              cNFT Minter 🖼️
            </h2>
            <div className="flex">
              <WalletMultiButton className="!bg-helius-orange hover:!bg-black transition-all duration-200 !rounded-lg" />
              <button
                type="submit"
                className="bg-helius-orange rounded-lg py-1 sm:py-2 px-4 font-semibold transition-all duration-200 border-2 border-transparent hover:border-helius-orange disabled:opacity-50 disabled:hover:bg-helius-orange hover:border-transparent disabled:cursor-not-allowed"
                disabled={!publicKey || !connection}
              >
                Mint
              </button>
            </div>
          </div>

          <div className="text-sm font-semibold mt-8 bg-[#222524] border-2 border-gray-500 rounded-lg p-2">
            <ul className="p-2">
              {outputs.map(({ title, dependency, href }, index) => (
                <li
                  key={title}
                  className={`flex justify-between items-center ${
                    index !== 0 && "mt-4"
                  }`}
                >
                  <p className="tracking-wider">{title}</p>
                  {dependency && (
                    <a
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex text-[#80ebff] italic hover:text-white transition-all duration-200"
                    >
                      {dependency.toString().slice(0, 25)}...
                      <ExternalLinkIcon className="w-5 ml-1" />
                    </a>
                  )}
                </li>
              ))}
            </ul>
          </div>

          <div className="mt-8 bg-[#222524] border-2 border-gray-500 rounded-lg p-4 h-[400px] flex justify-center items-center">
            {nftImage ? ( // if nftImage exists, render image, otherwise render text
              <img
                width={300}
                height={300}
                src={nftImage}
                className="rounded-lg border-2 border-gray-500"
              />
            ) : (
              <p className="border-2 border-gray-500 text-gray-500 p-2 rounded-lg">
                NFT Image Goes Here
              </p>
            )}
          </div>
        </form>
      </main> */}
    </>
  );
};

export default MintNFT;
