"use client";

import withReactContent from "sweetalert2-react-content";
import Swal from "sweetalert2";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { getToken } from "@/services/token";
import { useAppDispatch } from "@/lib/redux/hooks";
import {
  handlePageOrderFinished,
  handlePageOrderUnfinished,
} from "@/lib/redux/features/ordersSlice";

interface Props {
  item_code: string;
}

export default function OrderConfirmation(props: Props) {
  const dispatch = useAppDispatch();
  const router = useRouter();

  const [loading, setLoading] = useState<boolean>(false);

  const handleOrderConfirmation = async () => {
    try {
      const result = await withReactContent(Swal)
        .mixin({
          customClass: {
            confirmButton: "bg-success px-3 py-1.5 rounded-md text-white ml-1",
            cancelButton: "bg-fail px-3 py-1.5 rounded-md text-white mr-1",
          },
          buttonsStyling: false,
        })
        .fire({
          title: "Apa kamu yakin?",
          text: "Anda tidak akan dapat mengembalikan ini!",
          showCancelButton: true,
          confirmButtonText: "Ya",
          cancelButtonText: "Tidak",
          reverseButtons: true,
        });

      if (result.isConfirmed) {
        setLoading(true);

        const token = await getToken();

        if (token.status != "success") {
          console.error("Failed to logout");
          setLoading(false);
          return;
        }

        const confirmResponse = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/orders/${props.item_code}/confirm`,
          {
            method: "PUT",
            credentials: "include",
            headers: {
              Authorization: "Bearer " + token.authorization.access_token,
            },
          }
        );

        if (confirmResponse.status != 200) {
          console.error("Failed to input");
          setLoading(false);
          return;
        }

        withReactContent(Swal)
          .mixin({
            customClass: {
              popup: "max-w-[200px] w-full h-[100px]",
              icon: "scale-50 -translate-y-8",
            },
            buttonsStyling: false,
          })
          .fire({
            position: "top-end",
            icon: "success",
            showConfirmButton: false,
            timer: 500,
          });

        setTimeout(async () => {
          await dispatch(handlePageOrderUnfinished({ page: 1, limit: 8 }));
          await dispatch(handlePageOrderFinished({ page: 1, limit: 8 }));

          setLoading(false);
          router.push("/orders");
        }, 500);
      } else {
      }
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <button
      className="py-3 px-6 bg-two text-white mt-5 rounded-md font-bold tracking-wider uppercase mx-auto block"
      onClick={handleOrderConfirmation}>
      {!loading ? "Konfirmasi" : "Loading..."}
    </button>
  );
}