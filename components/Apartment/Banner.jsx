import React from 'react';


// import components
import Search from "./Search";
import { useTranslation } from "../../hooks/useTranslation";

const Banner = () => {

  const { t } = useTranslation();

  return (
    <section className="h-full max-h-[640px] mb-8 xl:mb-24">
      <div className="flex flex-col lg:flex-row">
        <div
          className="lg:ml-8 xl:ml-[135px] flex flex-col items-center lg:items-start
        text-center lg:text-left justify-center flex-1 px-4 lg:px-0"
        >
          <h1 className="text-4xl lg:text-[58px] font-semibold lending-none mb-6">
            {t("title_home")}
          </h1>
          <p className="max-w-[480px] mb-8">{t("content_home")}</p>
        </div>
        {/* image */}
        <div className="hidden flex-1 lg:flex justify-end items-end">
          <img src={`assets/img/house-banner.png`} alt="" />
        </div>
      </div>
      <Search />
    </section>
  );
  
};

export default Banner;
