'use client';

import { Carousel } from '@material-tailwind/react';
import Head from 'next/head';
import { useEffect, useState } from 'react';
import { isMobile } from 'react-device-detect';
import '@/lib/env';

type MainBanner = {
  pcImageUrl: string;
  mobileImageUrl: string;
  title: string;
  mainBannerId: number;
};

type MainShortcut = {
  imageUrl: string;
  title: string;
  mainShortcutId: number;
};

type PdCollection = {
  id: number;
  type: string;
  viewType: string;
  title: string;
  subtitle: string;
  items: {
    publication: {
      title: string;
      rating: number;
      media: { uri: string }[];
      priceInfo: {
        price: number;
        discountPrice?: number;
        discountRate?: number;
        couponDiscountPrice?: number;
        couponDiscountRate?: number;
      };
    };
  }[];
};

export default function HomePage() {
  const [mainBanners, setmainBanners] = useState<MainBanner[]>([]);
  const [mainShortcuts, setmainShortcuts] = useState<MainShortcut[]>([]);
  const [pdCollections, setpdCollections] = useState<PdCollection[]>([]);

  async function fetchMainBanners() {
    fetch('https://api.testvalley.kr/main-banner/all')
      .then((res) => res.json())
      .then((data) => {
        setmainBanners(data);
      });
  }

  async function fetchMainShortcuts() {
    fetch('https://api.testvalley.kr/main-shortcut/all')
      .then((res) => res.json())
      .then((data) => {
        setmainShortcuts(data);
      });
  }

  async function fetchPdCollections() {
    fetch('https://api.testvalley.kr/collections?prearrangedDiscount')
      .then((res) => res.json())
      .then((data: { items: PdCollection[] }) => {
        const filtered = data.items.filter((el) => {
          return el.type === 'SINGLE' && el.viewType === 'TILE';
        });
        setpdCollections(filtered);
      });
  }

  useEffect(() => {
    fetchMainBanners();
    fetchMainShortcuts();
    fetchPdCollections();
  }, []);

  return (
    <main>
      <Head>
        <title>Hi</title>
      </Head>

      <section className='bg-white lg:px-40 pb-20'>
        <Carousel className='h-1/3' placeholder={<></>}>
          {mainBanners.map((el) => (
            <img
              key={el.mainBannerId}
              src={isMobile ? el.mobileImageUrl : el.pcImageUrl}
              alt={el.title}
              className='h-full w-full object-cover'
            />
          ))}
        </Carousel>

        <section className='grid grid-cols-5 lg:grid-cols-10 pt-4 px-4 lg:p-0 lg:mt-10 justify-between'>
          {mainShortcuts.map((el) => (
            <div
              key={el.mainShortcutId}
              className='flex flex-col justify-center items-center min-w-14 p-1'
            >
              <img src={el.imageUrl} className='w-12 lg:w-16' alt='banner' />
              <div className='text-[0.7rem] mt-2'>{el.title}</div>
            </div>
          ))}
        </section>

        <section className='flex flex-col justify-between px-4 lg:p-0 lg:mt-10'>
          {pdCollections.map((el) => (
            <div className='lg:grid lg:grid-cols-8 mt-14' key={el.id}>
              <div className='pr-2 lg:col-span-2'>
                <h2 className='lg:text-2xl font-bold'>{el.title}</h2>
                <h4 className='text-xs font-normal mt-2 text-[#999999]'>
                  {el.subtitle}
                </h4>
              </div>

              <div className='grid grid-cols-2 lg:grid-cols-4 lg:col-span-6'>
                {el.items.slice(0, 4).map((item, idx) => {
                  const pub = item.publication;

                  const media = pub.media[0];
                  const priceInfo = pub.priceInfo;

                  return (
                    <div key={idx} className='p-1'>
                      <img src={media.uri} className='rounded' alt='product' />

                      <h3 className='text-sm font-normal text-ellipsis line-clamp-2'>
                        {pub.title}
                      </h3>

                      <div>
                        {priceInfo.couponDiscountRate ? (
                          <span className='text-lg text-[#FF5023] font-semibold mr-1'>
                            {priceInfo.couponDiscountRate}%
                          </span>
                        ) : priceInfo.discountRate ? (
                          <span className='text-lg font-semibold text-[#FF5023] mr-1'>
                            {priceInfo.discountRate}%
                          </span>
                        ) : (
                          <></>
                        )}

                        <span className='text-lg font-semibold'>
                          {(priceInfo.couponDiscountPrice
                            ? priceInfo.couponDiscountPrice
                            : priceInfo.discountPrice
                            ? priceInfo.discountPrice
                            : priceInfo.price
                          ).toLocaleString()}
                        </span>

                        <span className='text-xs'>원</span>
                      </div>

                      <div className='text-xs inline-flex'>
                        <img
                          src='https://www.testvalley.kr/star/star-darkgray.svg'
                          alt='rating'
                        />
                        {pub.rating}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </section>
      </section>
    </main>
  );
}
