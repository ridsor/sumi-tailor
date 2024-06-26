"use client";

import { useRef, useState } from "react";
import user_img from "@/assets/img/user-img.svg";
import FormProfilPassword from "./FormProfilePassword";
import Image from "next/image";
import { FaExclamationCircle } from "react-icons/fa";
import withReactContent from "sweetalert2-react-content";
import Swal from "sweetalert2";
import { editProfile } from "@/services/user";
import { UserType } from "@/types/user";

type Input = {
  name: string;
  email: string;
  image?: File;
};

type Validate = {
  name: string;
  email: string;
  image: string;
};

interface Props {
  user: UserType;
}

const WrapperFormProfile = (props: Props) => {
  const imageRef = useRef<HTMLInputElement>(null);

  const [imagePreviewUrl, setImagePreviewUrl] = useState<string>(
    `${process.env.NEXT_PUBLIC_API_URL}/images/${props.user.image}`
  );
  const [inputs, setInputs] = useState<Input>({
    name: props.user.name,
    email: props.user.email,
  });
  const [validate, setValidate] = useState<Validate>({
    name: "",
    email: "",
    image: "",
  });
  const [isInputLoading, setInputLoading] = useState<boolean>(false);
  const [isChangePassword, setChangePassword] = useState<boolean>(false);

  const onValidate = ({ name, email, image }: Input): boolean => {
    let result = false;

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

    var rs = email;
    var atps = rs.indexOf("@");
    var dots = rs.lastIndexOf(".");
    if (!email) {
      setValidate((prev) => ({
        ...prev,
        email: "Email tidak boleh kosong",
      }));
      result = true;
    } else if (atps < 1 || dots < atps + 2 || dots + 2 >= rs.length) {
      setValidate((prev) => ({
        ...prev,
        email: "Alamat email tidak valid",
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

    try {
      image = image as File;
      if (image) {
        if (!image.name.match(/\.(jpg|jpeg|png)$/)) {
          setValidate((prev) => ({
            ...prev,
            image: "Berkas tidak mendukung",
          }));
          result = true;
        } else if (image.size > 1 * 1000 * 1024) {
          setValidate((prev) => ({
            ...prev,
            image: "File harus kurang dari 1024",
          }));
          result = true;
        } else {
          setValidate((prev) => ({
            ...prev,
            image: "",
          }));
        }
      }
    } catch (e) {
      console.error(e);
    }

    return result;
  };

  const onSubmitEventHandler = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (onValidate(inputs)) return;
    setInputLoading(true);

    try {
      const formData = new FormData();
      formData.append("name", inputs.name);
      formData.append("email", inputs.email);
      formData.append("image", (inputs.image as File) || "");
      formData.append("profile", "true");

      const result = await editProfile(props.user?.id ?? "", formData);

      if (result.status != "success") {
        console.error("Failed to input");
        if (typeof result.errors.email != "undefined") {
          setValidate((prev) => ({ ...prev, email: result.errors.email }));
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

      setInputLoading(false);
    } catch (e) {
      console.error(e);
      setInputLoading(false);
    }
  };

  const onChangeEventHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.name == "image") {
      const files = e.target.files;
      setInputs((prev) => ({
        ...prev,
        [e.target.name]: files?.item(0),
      }));

      try {
        setImagePreviewUrl(URL.createObjectURL(files?.item(0) as File));
      } catch (e) {
        console.error(e);
      }
    } else {
      setInputs((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    }
  };

  const handleImageClick = () => {
    imageRef.current?.click();
  };

  return (
    <>
      {!isChangePassword ? (
        <form method="post" onSubmit={onSubmitEventHandler}>
          <div className="flex items-center gap-4 mb-4">
            <button
              type="button"
              onClick={handleImageClick}
              className={`${
                validate.image ? "ring-4 ring-fail" : ""
              } w-24 rounded-full aspect-square cursor-pointer relative`}>
              <Image
                src={imagePreviewUrl ? imagePreviewUrl : user_img}
                alt=""
                width={96}
                height={96}
                className={`w-full h-full object-cover rounded-full`}
                priority
              />
              {validate.image ? (
                <div className="absolute top-0 right-0 left-0 bottom-0">
                  <button
                    type={"button"}
                    className="text-fail block absolute top-1/2 -translate-y-1/2 right-4 peer z-20">
                    <FaExclamationCircle />
                  </button>
                  <div className="validate-message absolute left-[calc(100%+1.5rem)] w-fit whitespace-nowrap top-1/2 -translate-y-1/2 z-20 bg-fail text-white px-2 py-1 rounded-md before:content-[''] before:block before:absolute before:right-[calc(100%-1rem)] before:top-1/2 before:-translate-y-1/2 before:w-5 before:h-5 before:bg-fail before:-rotate-[36deg] before:skew-x-[20deg] before:-z-10 opacity-0 pointer-events-none transition-all peer-focus:opacity-100 peer-focus:pointer-events-auto peer-hover:opacity-100 peer-hover:pointer-events-auto">
                    <span>{validate.image as string}</span>
                  </div>
                </div>
              ) : (
                ""
              )}
            </button>
            <input
              ref={imageRef}
              type="file"
              name="image"
              id="image"
              hidden
              accept="image/png, image/jpeg, image/jpg"
              onChange={onChangeEventHandler}
            />
            <button
              type="button"
              onClick={() => setChangePassword((prev) => !prev)}
              className="px-3 mb-4 py-2 bg-gray-200 text-one rounded-md font-semibold hover:bg-gray-300 focus:ring focus:ring-[rgba(209,213,219,.5)]">
              {isChangePassword ? "Ubah Detail" : "Ubah Password"}
            </button>
          </div>
          <div className="form-input mb-4 max-w-md w-full">
            <label htmlFor="name" className="font-bold block">
              Nama
            </label>
            <div className="relative">
              <input
                type="text"
                id="name"
                name="name"
                className={`${
                  validate.name ? "border-fail pr-11" : ""
                } p-2 border-2 w-full rounded-md relative z-10`}
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
          </div>
          <div className="form-input mb-4 max-w-md w-full">
            <label htmlFor="email" className="font-bold block">
              Email
            </label>
            <div className="relative">
              <input
                type="text"
                id="email"
                name="email"
                className={`${
                  validate.email ? "border-fail pr-11" : ""
                } p-2 border-2 w-full rounded-md relative z-10`}
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
          </div>
          <div className="form-input mb-4">
            <button className="px-3 py-2 bg-two text-white rounded-md font-semibold hover:bg-four focus:ring focus:ring-[rgba(179,203,166,.5)]">
              {isInputLoading ? "Loading..." : "Simpan"}
            </button>
          </div>
        </form>
      ) : (
        <FormProfilPassword
          setChangePassword={setChangePassword}
          isChangePassword={isChangePassword}
          user={props.user}
        />
      )}
    </>
  );
};

export default WrapperFormProfile;
