import { getDay, getMonth, getTime, getYear } from "@/utils/order";
import { OrderType } from "@/lib/redux/features/ordersSlice";
import Image from "next/image";
import { SlideshowLightbox } from "lightbox.js-react";

interface Props {
  order: OrderType;
}

export default function OrderItem(props: Props) {
  const images = [
    {
      src: `${process.env.NEXT_PUBLIC_API_URL}/order-images/${props.order.image}`,
      alt: props.order.name,
    },
  ];

  return (
    <div className="order flex border rounded-md shadow-sm relative mb-3 hover:bg-[rgba(0,0,0,.1)]">
      <div className="flex-1 self-center">
        <div className="order-image lightbox-image min-w-[80px] w-[80px] h-[80px] relative z-20 overflow-hidden rounded-sm p-1.5">
          <SlideshowLightbox
            showControls={false}
            lightboxIdentifier={`${props.order.item_code}`}
            framework="next"
            fullScreen={true}
            modalClose="clickOutside"
            images={images}>
            {images.map((image, i) => (
              <Image
                key={i}
                src={image.src}
                alt={image.alt}
                width={250}
                height={250}
                className="w-full h-auto object-cover"
                data-lightboxjs={`${props.order.item_code}`}
                quality={50}
              />
            ))}
          </SlideshowLightbox>
        </div>
      </div>
      <div className="order-body py-1.5 px-1.5 sm:px-3 flex flex-col gap-y-1 w-full">
        <h4 className="font-semibold text-base">{props.order.name}</h4>
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