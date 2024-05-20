"use client";

import { OrderType } from "@/lib/redux/features/ordersSlice";
import { getDay, getMonth, getTime, getYear } from "@/utils/order";
import "@/app/(admin)/orders/style.css";
import "lightbox.js-react/dist/index.css";
import { useEffect, useState } from "react";
import { getOrderHistoryById } from "@/services/orders";
import { useParams } from "next/navigation";
import Loading from "./loading";
import { SlideshowLightbox } from "lightbox.js-react";
import Image from "next/image";
import NotFound from "@/app/(admin)/orders/history/[item_code]/NotFound";

export default function DetailOrder() {
  const params = useParams<{ item_code: string }>();

  const [isLoading, setLoading] = useState<boolean>(true);
  const [isNotFound, setNotFound] = useState<boolean>(false);
  const [order, setOrder] = useState<{
    loading: boolean;
    data: OrderType & { item_code: string };
  }>({
    loading: true,
    data: {
      item_code: "",
      name: "",
      no_hp: "",
      address: "",
      price: null,
      note: "",
      status: "",
      image: "",
      created_at: "",
      updated_at: "",
    },
  });

  const images = [
    {
      src: `${process.env.NEXT_PUBLIC_API_URL}/order-images/${order.data.image}`,
      alt: order.data.name,
    },
  ];

  useEffect(() => {
    if (!isLoading) {
      try {
        getOrderHistoryById(params.item_code).then((order) => {
          if (order) {
            setNotFound(false);

            setOrder({
              loading: false,
              data: order,
            });
          } else {
            setNotFound(true);
          }
        });
      } catch (e) {
        console.error(e);
      }
    } else {
      setLoading(false);
    }
  }, [isLoading, params.item_code]);

  if (isNotFound) {
    return <NotFound />;
  }

  if (order.loading) {
    return <Loading />;
  }

  return (
    <main>
      <section className="py-15 md:text-base">
        <div className="container border-4 h-screen flex flex-col max-h-[1080px] min-h-[508px]">
          <div className="flex justify-between px-4 py-2 border-b border-five items-center gap-2">
            <h1 className="font-bold text-xl md:text-3xl">Detail Pesanan</h1>
          </div>
          <div className="px-4">
            <div className="flex mb-2 mt-3">
              <div className="flex justify-between flex-1 gap-2">
                <span className="font-semibold">Nama</span>
                <span id="name">{order.data.name}</span>
              </div>
            </div>
            <div className="flex mb-2">
              <div className="flex justify-between flex-1 gap-2">
                <span className="font-semibold">No Handphone</span>
                <span id="no_hp">{order.data.no_hp}</span>
              </div>
            </div>
            <div className="flex mb-2">
              <div className="flex justify-between flex-1 gap-2">
                <span className="font-semibold">Alamat</span>
                <span id="address">{order.data.address}</span>
              </div>
            </div>
            <div className="flex mb-3">
              <div className="flex justify-between flex-1 gap-2">
                <span className="font-semibold">Tanggal Pemesanan</span>
                <span id="date">
                  {`${getDay(order.data.updated_at)} ${getMonth(
                    order.data.updated_at
                  )} ${getYear(order.data.updated_at)}, ${getTime(
                    order.data.updated_at
                  )} WIT`}
                </span>
              </div>
            </div>
          </div>
          <div className="p-4 border-t-8 flex-1 flex flex-col">
            <div className="lightbox-image min-w-[150px] w-[150px] h-[150px] relative z-20 overflow-hidden rounded-sm mb-3">
              <SlideshowLightbox
                showControls={false}
                lightboxIdentifier={order.data.item_code}
                framework="next"
                fullScreen={true}
                modalClose="clickOutside"
                images={images}>
                {images.map((image, i) => (
                  <Image
                    key={i}
                    src={image.src}
                    alt={image.alt}
                    width={300}
                    height={300}
                    priority
                    className="w-full h-auto object-cover"
                    data-lightboxjs={order.data.item_code}
                    quality={50}
                  />
                ))}
              </SlideshowLightbox>
            </div>
            <div
              className="border flex flex-col rounded-md py-2 px-3 border-five flex-1"
              id="note">
              <h6 className="font-semibold">Catatan</h6>
              <p className="flex-1">{order.data.note}</p>
              <hr className="my-3 border-five" />
              <div className="text-[12px]">Total Harga</div>
              <div className="font-bold" id="price">
                Rp
                {order.data.price
                  ? Intl.NumberFormat("id-ID").format(order.data.price)
                  : " -"}
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}