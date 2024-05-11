"use client";

import OrderConfirmation from "./OrderConfirmation";
import { OrderType } from "@/lib/redux/features/ordersSlice";
import { getDay, getMonth, getTime, getYear } from "@/utils/order";
import OrderMenu from "./OrderMenu";
import "../style.css";
import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/lib/redux/hooks";
import { getOrderById } from "@/services/orders";
import { useParams } from "next/navigation";
import { getUser } from "@/lib/redux/features/userSlice";
import Loading from "./loading";
import OrderInput from "./OrderInput";

export default function DetailOrder() {
  const dispatch = useAppDispatch();
  const params = useParams<{ item_code: string }>();

  const user = useAppSelector((state) => state.user);

  const [isInputModal, setInputModal] = useState<boolean>(false);
  const [isLoading, setLoading] = useState<boolean>(true);
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

  const toggleInputModal = () => setInputModal((prev) => !prev);

  useEffect(() => {
    dispatch(getUser());
  }, [dispatch]);

  useEffect(() => {
    if (!isLoading) {
      try {
        getOrderById(params.item_code).then((order) =>
          setOrder({
            loading: false,
            data: order,
          })
        );
      } catch (e) {
        console.error(e);
      }
    } else {
      setLoading(false);
    }
  }, [isLoading, params.item_code]);

  return order.loading ? (
    <Loading />
  ) : (
    <main>
      <section className="py-15">
        <div className="container border-4 h-screen flex flex-col max-h-[1080px] min-h-[508px]">
          <div className="flex justify-between px-4 py-2 border-b border-five items-center">
            <h1 className="font-bold text-xl">Detail Pesanan</h1>
            <OrderMenu
              order={order.data}
              user={user}
              toggleModal={toggleInputModal}
            />
          </div>
          <div className="px-4">
            <h2 className="font-semibold text-base border-b py-2 mb-3 border-five">
              Pesanan{" "}
              {order.data.status === "isFinished" ? "Selesai" : "Diproses"}
            </h2>
            <div className="flex mb-2">
              <div className="flex justify-between flex-1">
                <span>Nama</span>
                <span id="name">{order.data.name}</span>
              </div>
            </div>
            <div className="flex mb-2">
              <div className="flex justify-between flex-1">
                <span>No Handphone</span>
                <span id="no_hp">{order.data.no_hp}</span>
              </div>
            </div>
            <div className="flex mb-2">
              <div className="flex justify-between flex-1">
                <span>Alamat</span>
                <span id="address">{order.data.address}</span>
              </div>
            </div>
            <div className="flex mb-3">
              <div className="flex justify-between flex-1">
                <span>Tanggal Pembelian</span>
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
            <OrderConfirmation item_code={params.item_code} />
          </div>
        </div>
      </section>
      <section>
        <OrderInput isModal={isInputModal} toggleModal={toggleInputModal} />
      </section>
    </main>
  );
}
