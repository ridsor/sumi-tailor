import { getDay, getMonth, getTime, getYear } from "@/utils/order";
import Link from "next/link";
import Image from "next/image";
import Lightbox from "yet-another-react-lightbox";
import NextJsImage from "@/components/fragments/NextJsImage";
import { useState } from "react";
import { OrderHistoryType } from "@/types/order";

interface Props {
  order: OrderHistoryType;
}

export default function OrderItem(props: Props) {
  const [openLightbox, setOpenLightbox] = useState<boolean>(false);

  const slides = [
    {
      src: `${process.env.NEXT_PUBLIC_API_URL}/order-images/${props.order.image}`,
      alt: `${props.order.name}-${props.order.item_code}`,
    },
  ];

  return (
    <div className="order flex border rounded-md shadow-sm relative mb-3 w-full sm:w-[calc(50%-6px)]">
      <Link
        href={`/orders/history/${props.order.item_code}`}
        className="absolute top-0 bottom-0 left-0 right-0 bg-transparent rounded-md z-10 hover:bg-[rgba(0,0,0,.1)]"
        aria-label="Order Item"></Link>
      <div className="flex-1 self-center">
        <div className="order-image lightbox-image min-w-[80px] w-[80px] h-[80px] relative z-20 overflow-hidden rounded-sm p-1.5">
          <button
            type="button"
            onClick={() => setOpenLightbox(true)}
            className="w-full h-full">
            <Image
              src={slides[0].src}
              alt={slides[0].alt}
              width={400}
              height={400}
              className="w-full h-full object-cover"
            />
          </button>
          <Lightbox
            open={openLightbox}
            close={() => setOpenLightbox(false)}
            slides={slides}
            render={{
              slide: NextJsImage,
              iconNext: () => null,
              iconPrev: () => null,
            }}
            noScroll={{ disabled: true }}
            carousel={{ finite: true }}
          />
        </div>
      </div>
      <div className="order-body py-1.5 px-1.5 sm:px-3 flex flex-col gap-y-1 w-full">
        <h4 className="font-semibold text-base">{props.order.name}</h4>
        <div className="price text-success sm:text-base">
          {props.order.description}
        </div>
        <div className="grid flex-1 sm:grid-flow-col">
          <div className="date text-blue-400">{`${getDay(
            props.order.updated_at
          )} ${getMonth(props.order.updated_at)} ${getYear(
            props.order.updated_at
          )}, ${getTime(props.order.updated_at)} WIT`}</div>
          <div className="price font-semibold text-two sm:text-base justify-self-end mt-1 self-end">
            Rp
            {props.order.price
              ? new Intl.NumberFormat("id-ID").format(props.order.price)
              : " -"}
          </div>
        </div>
      </div>
    </div>
  );
}
