import { FaXmark } from "react-icons/fa6";
import Modal from "@/components/fragments/Modal";
import { FaExclamationCircle } from "react-icons/fa";
import { useCallback, useEffect, useState } from "react";
import withReactContent from "sweetalert2-react-content";
import Swal from "sweetalert2";
import { createOrder } from "@/services/orders";

export type OrderInput = {
  name: string;
  email: string;
  no_hp: string;
  address: string;
  price: string;
  note: string;
  image: File | string;
};

type Validate = OrderInput;

interface Props {
  isModal: boolean;
  toggleModal: () => void;
}

export default function OrderInput(props: Props) {
  const [InputLoading, setInputLoading] = useState<boolean>(false);
  const [inputs, setInputs] = useState<OrderInput>({
    name: "",
    email: "",
    no_hp: "",
    address: "",
    price: "",
    note: "",
    image: "",
  });

  const [validate, setValidate] = useState<Validate>({
    name: "",
    email: "",
    no_hp: "",
    address: "",
    price: "",
    note: "",
    image: "",
  });

  const onValidate = useCallback(
    ({
      name,
      email,
      no_hp,
      address,
      price,
      note,
      image,
    }: OrderInput): boolean => {
      let result: boolean = false;

      // name
      if (!name) {
        setValidate((prev) => ({ ...prev, name: "Nama tidak boleh kosong" }));
        result = true;
      } else if (name.length > 100) {
        setValidate((prev) => ({
          ...prev,
          name: "Nama harus memiliki maks 100 karakter",
        }));
        result = true;
      } else {
        setValidate((prev) => ({
          ...prev,
          name: "",
        }));
      }

      // email
      var rs = email;
      var atps = rs.indexOf("@");
      var dots = rs.lastIndexOf(".");
      if (email) {
        if (atps < 1 || dots < atps + 2 || dots + 2 >= rs.length) {
          setValidate((prev) => ({
            ...prev,
            email: "Email tidak valid",
          }));
          result = true;
        } else if (email.length > 100) {
          setValidate((prev) => ({
            ...prev,
            email: "Email harus memiliki maks 100 karakter",
          }));
          result = true;
        } else {
          setValidate((prev) => ({
            ...prev,
            email: "",
          }));
        }
      }

      // no_hp
      if (!no_hp) {
        setValidate((prev) => ({
          ...prev,
          no_hp: "Kategori tidak boleh kosong",
        }));
        result = true;
      } else if (no_hp.length > 100) {
        setValidate((prev) => ({
          ...prev,
          no_hp: "Kategori harus memiliki maks 100 karakter",
        }));
        result = true;
      } else {
        setValidate((prev) => ({
          ...prev,
          no_hp: "",
        }));
      }

      // address
      if (!address) {
        setValidate((prev) => ({
          ...prev,
          address: "Kategori tidak boleh kosong",
        }));
        result = true;
      } else if (address.length > 1000) {
        setValidate((prev) => ({
          ...prev,
          address: "Kategori harus memiliki maks 1000 karakter",
        }));
        result = true;
      } else {
        setValidate((prev) => ({
          ...prev,
          address: "",
        }));
      }

      // price
      if (isNaN(parseInt(price)) && price !== "") {
        setValidate((prev) => ({
          ...prev,
          price: "Harga harus angka",
        }));
        result = true;
      } else if (price.length > 500) {
        setValidate((prev) => ({
          ...prev,
          price: "Harga harus memiliki maks 100 karakter",
        }));
        result = true;
      } else {
        setValidate((prev) => ({
          ...prev,
          price: "",
        }));
      }

      if (!note) {
        setValidate((prev) => ({
          ...prev,
          note: "Catatan tidak boleh kosong",
        }));
        result = true;
      } else if (note.length > 1000) {
        setValidate((prev) => ({
          ...prev,
          note: "Catatan harus memiliki maks 1000 karakter",
        }));
        result = true;
      } else {
        setValidate((prev) => ({
          ...prev,
          note: "",
        }));
      }

      // image
      try {
        image = image as File;
        if (!image.name.match(/\.(jpg|jpeg|png)$/)) {
          setValidate((prev) => ({
            ...prev,
            image: "Berkas tidak mendukung",
          }));
          result = true;
        } else if (image.size > 5 * 1000 * 1024) {
          setValidate((prev) => ({
            ...prev,
            image: "File harus kurang dari 5mb",
          }));
          result = true;
        } else {
          setValidate((prev) => ({
            ...prev,
            image: "",
          }));
        }
      } catch (e) {
        console.error(e);
      }

      return result;
    },
    []
  );

  const onSubmitEventHandler = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setValidate({
      name: "",
      email: "",
      no_hp: "",
      address: "",
      price: "",
      note: "",
      image: "",
    });

    if (onValidate(inputs)) return;

    setInputLoading(true);

    try {
      const createResponse = await createOrder(inputs);

      if (createResponse?.status != "success") {
        console.error("Failed to input");
        if (typeof createResponse?.errors.email != "undefined") {
          setValidate((prev) => ({
            ...prev,
            email: createResponse?.errors.email,
          }));
        }
        if (typeof createResponse?.errors.no_hp != "undefined") {
          setValidate((prev) => ({
            ...prev,
            no_hp: createResponse?.errors.no_hp,
          }));
        }
        setInputLoading(false);
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
    } catch (e) {
      console.log(e);
    }

    props.toggleModal();
    setInputLoading(false);
  };

  const onChangeEventHandler = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setInputs((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  useEffect(() => {
    setValidate({
      name: "",
      email: "",
      no_hp: "",
      address: "",
      price: "",
      note: "",
      image: "",
    });
    setInputs({
      name: "",
      email: "",
      no_hp: "",
      address: "",
      price: "",
      note: "",
      image: "",
    });
  }, []);

  return (
    <Modal active={props.isModal} openclose={props.toggleModal}>
      <div className="container max-w-full">
        <div className="title-modal font-semibold text-xl px-3 py-2 border-b relative">
          Buat Pesanan
          <button
            className="absolute top-1/2 -translate-y-1/2 right-3"
            aria-label="Exit Modal"
            onClick={() => props.toggleModal()}>
            <FaXmark />
          </button>
        </div>
        <form method="post" className="p-4" onSubmit={onSubmitEventHandler}>
          <div className="form-input mb-3 relative">
            <input
              type="text"
              placeholder="Nama"
              name="name"
              className={`${
                validate.name ? "border-fail pr-11 relative" : ""
              } w-full border rounded-sm py-2 px-3 relative z-10`}
              onChange={onChangeEventHandler}
              value={inputs.name}
            />
            {validate.name ? (
              <div className="absolute top-0 right-0 left-0 bottom-0">
                <button
                  type={"button"}
                  className="text-fail block absolute top-1/2 -translate-y-1/2 right-4 peer z-20">
                  <FaExclamationCircle />
                </button>
                <div className="validate-message absolute right-12 top-1/2 -translate-y-1/2 z-20 max-w-full w-fit bg-fail text-white px-2 py-1 rounded-md before:content-[''] before:block before:absolute before:left-[calc(100%-1rem)] before:top-1/2 before:-translate-y-1/2 before:w-5 before:h-5 before:bg-fail before:-rotate-[36deg] before:skew-x-[20deg] before:-z-10 opacity-0 pointer-events-none transition-all peer-focus:opacity-100 peer-focus:pointer-events-auto peer-hover:opacity-100 peer-hover:pointer-events-auto">
                  <span>{validate.name}</span>
                </div>
              </div>
            ) : (
              ""
            )}
          </div>
          <div className="form-input mb-3 relative">
            <input
              type="email"
              placeholder="Email"
              name="email"
              className={`${
                validate.email ? "border-fail pr-11" : ""
              } w-full border rounded-sm py-2 px-3 relative z-10`}
              onChange={onChangeEventHandler}
              value={inputs.email}
            />
            {validate.email ? (
              <div className="absolute top-0 right-0 left-0 bottom-0">
                <button
                  type={"button"}
                  className="text-fail block absolute top-1/2 -translate-y-1/2 right-4 peer z-20">
                  <FaExclamationCircle />
                </button>
                <div className="validate-message absolute right-12 top-1/2 -translate-y-1/2 z-20 max-w-full w-fit bg-fail text-white px-2 py-1 rounded-md before:content-[''] before:block before:absolute before:left-[calc(100%-1rem)] before:top-1/2 before:-translate-y-1/2 before:w-5 before:h-5 before:bg-fail before:-rotate-[36deg] before:skew-x-[20deg] before:-z-10 opacity-0 pointer-events-none transition-all peer-focus:opacity-100 peer-focus:pointer-events-auto peer-hover:opacity-100 peer-hover:pointer-events-auto">
                  <span>{validate.email}</span>
                </div>
              </div>
            ) : (
              ""
            )}
          </div>
          <div className="form-input mb-3 relative">
            <input
              type="text"
              placeholder="No Handphone"
              name="no_hp"
              className={`${
                validate.no_hp ? "border-fail pr-11" : ""
              } w-full border rounded-sm py-2 px-3 relative z-10`}
              onChange={onChangeEventHandler}
              value={inputs.no_hp}
            />
            {validate.no_hp ? (
              <div className="absolute top-0 right-0 left-0 bottom-0">
                <button
                  type={"button"}
                  className="text-fail block absolute top-1/2 -translate-y-1/2 right-4 peer z-20">
                  <FaExclamationCircle />
                </button>
                <div className="validate-message absolute right-12 top-1/2 -translate-y-1/2 z-20 max-w-full w-fit bg-fail text-white px-2 py-1 rounded-md before:content-[''] before:block before:absolute before:left-[calc(100%-1rem)] before:top-1/2 before:-translate-y-1/2 before:w-5 before:h-5 before:bg-fail before:-rotate-[36deg] before:skew-x-[20deg] before:-z-10 opacity-0 pointer-events-none transition-all peer-focus:opacity-100 peer-focus:pointer-events-auto peer-hover:opacity-100 peer-hover:pointer-events-auto">
                  <span>{validate.no_hp}</span>
                </div>
              </div>
            ) : (
              ""
            )}
          </div>
          <div className="form-input mb-3 relative">
            <input
              type="text"
              placeholder="Alamat"
              name="address"
              className={`${
                validate.address ? "border-fail pr-11" : ""
              } w-full border rounded-sm py-2 px-3 relative z-10`}
              onChange={onChangeEventHandler}
              value={inputs.address}
            />
            {validate.address ? (
              <div className="absolute top-0 right-0 left-0 bottom-0">
                <button
                  type={"button"}
                  className="text-fail block absolute top-1/2 -translate-y-1/2 right-4 peer z-20">
                  <FaExclamationCircle />
                </button>
                <div className="validate-message absolute right-12 top-1/2 -translate-y-1/2 z-20 max-w-full w-fit bg-fail text-white px-2 py-1 rounded-md before:content-[''] before:block before:absolute before:left-[calc(100%-1rem)] before:top-1/2 before:-translate-y-1/2 before:w-5 before:h-5 before:bg-fail before:-rotate-[36deg] before:skew-x-[20deg] before:-z-10 opacity-0 pointer-events-none transition-all peer-focus:opacity-100 peer-focus:pointer-events-auto peer-hover:opacity-100 peer-hover:pointer-events-auto">
                  <span>{validate.address}</span>
                </div>
              </div>
            ) : (
              ""
            )}
          </div>
          <div className="form-input mb-3 relative">
            <input
              type="text"
              placeholder="Harga"
              name="price"
              className={`${
                validate.price ? "border-fail pr-11" : ""
              } w-full border rounded-sm py-2 px-3 relative z-10`}
              onChange={onChangeEventHandler}
              value={inputs.price}
            />
            {validate.price ? (
              <div className="absolute top-0 right-0 left-0 bottom-0">
                <button
                  type={"button"}
                  className="text-fail block absolute top-1/2 -translate-y-1/2 right-4 peer z-20">
                  <FaExclamationCircle />
                </button>
                <div className="validate-message absolute right-12 top-1/2 -translate-y-1/2 z-20 max-w-full w-fit bg-fail text-white px-2 py-1 rounded-md before:content-[''] before:block before:absolute before:left-[calc(100%-1rem)] before:top-1/2 before:-translate-y-1/2 before:w-5 before:h-5 before:bg-fail before:-rotate-[36deg] before:skew-x-[20deg] before:-z-10 opacity-0 pointer-events-none transition-all peer-focus:opacity-100 peer-focus:pointer-events-auto peer-hover:opacity-100 peer-hover:pointer-events-auto">
                  <span>{validate.price}</span>
                </div>
              </div>
            ) : (
              ""
            )}
          </div>
          <div className="form-input mb-3 relative">
            <textarea
              name="note"
              placeholder="Catatan"
              rows={3}
              className={`${
                validate.note ? "border-fail pr-11" : ""
              } w-full border rounded-sm py-2 px-3 relative z-10`}
              onChange={onChangeEventHandler}
              value={inputs.note}></textarea>
            {validate.note ? (
              <div className="absolute top-0 right-0 left-0 bottom-0">
                <button
                  type={"button"}
                  className="text-fail block absolute top-1/2 -translate-y-1/2 right-4 peer z-20">
                  <FaExclamationCircle />
                </button>
                <div className="validate-message absolute right-12 top-1/2 -translate-y-1/2 z-20 max-w-full w-fit bg-fail text-white px-2 py-1 rounded-md before:content-[''] before:block before:absolute before:left-[calc(100%-1rem)] before:top-1/2 before:-translate-y-1/2 before:w-5 before:h-5 before:bg-fail before:-rotate-[36deg] before:skew-x-[20deg] before:-z-10 opacity-0 pointer-events-none transition-all peer-focus:opacity-100 peer-focus:pointer-events-auto peer-hover:opacity-100 peer-hover:pointer-events-auto">
                  <span>{validate.note}</span>
                </div>
              </div>
            ) : (
              ""
            )}
          </div>
          <div className="form-input">
            <button className="w-full bg-two px-3 py-2 text-white rounded-sm font-semibold">
              {InputLoading ? "Loading..." : "Simpan"}
            </button>
          </div>
        </form>
      </div>
    </Modal>
  );
}