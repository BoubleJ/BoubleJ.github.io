---
date: "2024-02-12"
title: "[마켓플레이스 프로젝트] 문의 페이지 presignedUrl 활용 S3 업로드"
categories:
  [
    "MarketPlace"
   
  ]
summary: "온갖 에러가 폭주하는 작업이었다. 정말 열받네"
thumbnail: "/image/image-9.png"
---

온갖 에러가 폭주하는 작업이었다. 정말 열받네

```tsx
//page.tsx

"use client";

import React, { useState } from "react";

import { baseURL } from "@/api/util/instance";
import AddInquiryBottomSeat from "@/components/feature/addInquiry/AddInquiryBottomSeat";
import AddInquiryTypeBox from "@/components/feature/addInquiry/AddInquiryTypeBox";
import SvgIconPlusMono from "@/components/icons/icon-plus-mono";
import { Button } from "@/components/ui/button";

export default function page() {
  const [isBottomSheetOpen, setIsBottomSheetOpen] = useState(false);
  const list = ["불만", "가득", "이게 나라냐 "];
  const [inquiryType, setInquiryType] = useState(list[0]);
  const [src, setSrc] = useState("");

  return (
    <>
      <div className="w-full h-full p-4">
        <p className="text-body-base pb-2">
          문의 유형<span className="text-red-600">*</span>
        </p>
        <AddInquiryTypeBox
          setIsBottomSheetOpen={setIsBottomSheetOpen}
          inquiryType={inquiryType}
        />
        <AddInquiryBottomSeat
          isBottomSheetOpen={isBottomSheetOpen}
          setIsBottomSheetOpen={setIsBottomSheetOpen}
          list={list}
          setInquiryType={setInquiryType}
        />
        <form action="/api" method="POST">
          <p className="text-body-base pb-2">
            문의 내용<span className="text-red-600">*</span>
          </p>
          <input
            className="border focus:border-black focus:outline-0 h-12 rounded-md p-2 text-sm border-gray-300 w-full mb-4"
            type="text"
            placeholder="제목을 입력해주세요"
            name="title"
          />
          <textarea
            className="border focus:border-black focus:outline-0 h-32 rounded-md p-3 text-sm border-gray-300 w-full mb-12"
            placeholder="문의하실 내용을 입력해주세요."
            name="content"
          />
          <div className="flex flex-col gap-4">
            <div className="w-20 h-20 border-2 rounded-md relative">
              <input
                type="file"
                id="file"
                name="cardImg"
                className="opacity-0 h-full w-full border-2"
                multiple
                accept="image/*"
                onChange={async (e) => {
                  let file = e.target.files[0];
                  let filename = encodeURIComponent(file.name);
                  let res = await fetch(
                    `${baseURL}/api/reviews/generate-presigned-url?fileName=${filename}&contentType=image/jpeg`
                  );
                  res = await res.json();
                  console.log(res);

                  //S3 업로드
                  const formData = new FormData();
                  Object.entries({ ...res.fields, file }).forEach(
                    ([key, value]) => {
                      formData.append(key, value);
                    }
                  );
                  let 업로드결과 = await fetch(res.msg, {
                    method: "POST",
                    body: formData,
                  });

                  if (업로드결과.ok) {
                    setSrc(업로드결과.msg + "/" + filename);
                  } else {
                    console.log("실패");
                  }
                }}
              ></input>
              <SvgIconPlusMono
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-gray-600"
                height={"1.5rem"}
                width={"1.5rem"}
              />
              <img src={src}></img>
            </div>
            <div className="text-xs text-grayscale-300">
              <p>30MB 이하의 이미지만 업로드 가능합니다.</p>
              <p>
                상품과 무관한 내용이거나 음란 및 불법적인 내용은 통보없이 삭제
                될 수 있습니다.
              </p>
              <p>사진은 최대 8장 등록 가능합니다.</p>
            </div>
          </div>
          <div className="fixed bottom-0 p-4 left-1/2 -translate-x-1/2 w-96 h-20 bg-white">
            <Button type="submit" variant={"primary"} className="w-full h-full">
              등록하기
            </Button>
          </div>
        </form>
      </div>
    </>
  );
}
```

다음과 같이 코드를 짰다.

``${baseURL}/api/reviews/generate-presigned-url?fileName=${filename}&contentType=image/jpeg`,`

get요청보내는 url 부분에서 자꾸 에러가 났었다.

baseURL가 아니라 baseLocalURL 인가… 수정해봤지만 똑같이 안됐다.

![alt text](/image/image-9.png)

분명히 이 주소가 맞는데…

다른 api 주소를 봐도

![alt text](/image/image-10.png)

분명 api 불러오는 주소는 baseURL이 맞다.. 뭐가 문제일까???

혹시 몰라서 baseURL을 콘솔 찍어보니

![alt text](/image/image-11.png)

맙소사 api 슬러그까지 포함된 주소였따….

즉 난

`http 어쩌구/api/api/reviews/generate-presigned-url?fileName=${filename}&contentType=image/jpeg`,`

라는 주소로 자꾸 get 요청을 보내서 에러가 난 것이었다.

get요청 주소를

``${baseURL}/reviews/generate-presigned-url?fileName=${filename}&contentType=image/jpeg`,`

로 수정하니 정상적으로 콘솔이찍혔다 야호!!

![alt text](/image/image-12.png)

하지만 넘어야할 산은 끝나지 않았다.

이번엔

```tsx
//S3 업로드
const formData = new FormData();
Object.entries({ ...res.fields, file }).forEach(([key, value]) => {
  formData.append(key, value);
});
let 업로드결과 = await fetch(res.url, {
  method: "POST",
  body: formData,
});

if (업로드결과.ok) {
  setSrc(업로드결과.url + "/" + filename);
} else {
  console.log("실패");
}
```

s3 업로드 코드가 문제였다.

참고로 이 코드는 애플코딩에서 그냥 복붙해서 쓰면 된다해서 일단 가져왔다. 근데 어떻게 동작하는지 원리를 알아야할 듯 싶다. 에러가 나니까…

하나하나 뜯어보도록하자

일단 받아오는 presignURL이 어떤 구조로 이루어져있는지 확인할 필요가 있다.

![alt text](/image/image-13.png)

msg라는 값만 가지고 있는 단순한 객체 형태이다. 그리고 msg : **~~~~ 어쩌구 저쩌구**

이 **~~~~ 어쩌구 저쩌구** 가 바로 서버에서 받아온 presignURL이다. 즉

```tsx
//S3 업로드
                onChange={async (e) => {
                  let file = e.target.files[0]
                  let filename = encodeURIComponent(file.name)
                  let res = await fetch(
                    `${baseURL}/api/reviews/generate-presigned-url?fileName=${filename}&contentType=image/jpeg`,
                  )
                  res = await res.json()
                  console.log(res)
									//res가 {msg : 'presignURL 주소'} 형태의 객체이다.
									// 즉 res에는 url이라는 key 값이 존재하지 않으니 에러가 뜬 것이다.

                  //S3 업로드
                  const formData = new FormData()
                  Object.entries({ ...res.fields, file }).forEach(([key, value]) => {
                    formData.append(key, value)
                  })
                  let 업로드결과 = await fetch(res.url, {
																				// 요기 res.url가 아닌 res.msg로 바꿔줘야한다.
                    method: 'POST',
                    body: formData,
                  })

                  if (업로드결과.ok) {
                    setSrc(업로드결과.msg + '/' + filename)
                  } else {
                    console.log('실패')
                  }
                }}
```

```tsx
let 업로드결과 = await fetch(res.url, {
  // 요기 res.url가 아닌 res.msg로 바꿔줘야한다.
  method: "POST",
  body: formData,
});
```

다음과 같이 수정해준다.

이제 업로드결과라는 let 변수가 정상적으로 출력되는지 확인해보자

```tsx
let 업로드결과 = await fetch(res.url, {
  // 요기 res.url가 아닌 res.msg로 바꿔줘야한다.
  method: "POST",
  body: formData,
});
console.log(업로드결과);
```

![alt text](/image/image-14.png)

출력되긴한다. 하지만 post요청은 실패했다. 산넘어 산이다.

업로드 결과 변수 내부에

`url : "https://asac-marketplace-s3.s3.ap-northeast-2.amazonaws.com/dog.jpg?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-A`~~~

다음과 같은 프로퍼티가 존재한다. url을 찾았다.

그렇다면

```tsx
if (업로드결과.ok) {
  setSrc(업로드결과.msg + "/" + filename);
  //업로드결과.msg를 업로드결과.url로 바꿔줘야한다.
} else {
  console.log("실패");
}
```

```tsx
if (업로드결과.ok) {
  setSrc(업로드결과.url + "/" + filename);
  //업로드결과.msg를 업로드결과.url로 바꿔줘야한다.
  console.log(src);
  //혹시 모르니 src도 콘솔출력해보자
} else {
  console.log("실패");
}
```

수정 후 다시 사진 업로드를 시도해봤다.

![alt text](/image/image-15.png)

여전히 안된다. 정말 열받는다. 네트워크를 확인해보자.

generate-presign 어쩌구가 presignURL을 요청한 주소다. 여긴 잘됐다.

![alt text](/image/image-16.png)

다음이 문제다. POST 요청이 실패했다. 때문에 src도 출력되지 않았다

![alt text](/image/image-17.png)

흠.. 뭐가 문제일까. 일단 s3에 적재되는지 확인부터 해볼까 브라우저에 이미지 띄우는건 차치해두도록하자.

post 요청 대신 put으로 바꿔보았다.

```tsx
let 업로드결과 = await fetch(res.msg, {
  method: "PUT",
  body: formData,
});
```

다음과 같이 수정한 후 다시 업로드를 시도했다.

요청을 put으로 바꾸니 성공했다. 근데 src는 url이 할당되지 않았다. (참고로 src 초기값은 내가 그냥 hi로 설정했었다. ) 사실 당연한게 put 요청은 브라우저에서 데이터를 서버에 등록하는 요청이지 가져오는 요청이 아니기 때문에 당연히 src는 변하지 않는다. 서버에서 url을 가져오는 요쳥 자체를 안했으니… s3에 사진 업로드 후 url을 가져오려면 post 요청을 해야한다.

![alt text](/image/image-18.png)

네트워크도 put 요청은 성공했다한다.

![alt text](/image/image-19.png)

이 get 요청은 뭔지 모르겠다… 한적이 없는데 왜 요청하는건지…

![alt text](/image/image-20.png)

이제 s3를 확인해보자. 실제로 s3 버킷에 사진이 업로드 됐는지 확인해봐야한다.

![alt text](/image/image-21.png)

업로드는 성공이다. 휴 다행이다…

그렇다면 이제 왜 post 요청은 안되는지 확인해봐야한다.

사실 에드님이 테스트용으로 만든 postman 을 보면 put 요청이긴하다. 근데 이게 상관있나..??

음 원래 put 요청을 하는거였구나. 몰랐네ㅎㅎㅎ

하 s3 업로드는 성공인줄 알았는데… 개열받네 진짜… 이미지를 읽지를 못한다. 하…

벨라님이 도움을 주셨다. 감사합니다.

```tsx
//add-inquiry 페이지 (page.tsx)

"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { useForm } from "react-hook-form";

import { baseURL } from "@/api/util/instance";
import AddInquiryBottomSeat from "@/components/feature/addInquiry/AddInquiryBottomSeat";
import AddInquiryTypeBox from "@/components/feature/addInquiry/AddInquiryTypeBox";
import SvgIconPlusMono from "@/components/icons/icon-plus-mono";
import { Button } from "@/components/ui/button";

export default function page() {
  const [isBottomSheetOpen, setIsBottomSheetOpen] = useState(false);
  const list = ["불만", "가득", "이게 나라냐 "];
  const [inquiryType, setInquiryType] = useState(list[0]);
  const router = useRouter();
  const [isImage, setIsImage] = useState(false);

  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [presignedURLs, setPresignedURLs] = useState<string[]>([]);
  const [imageURLs, setImageURLs] = useState<string[]>([]);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm();

  const images = watch("images", []);

  const uploadImage = async (presignedURL: string, imageFile: File | null) => {
    try {
      const fileUpload = await fetch(presignedURL, {
        method: "PUT",
        body: imageFile,
      });
      //presignedURLs라는 배열 내부 요소들을 presignedURL이라 지정하고 그 주소에 put 요청을 보낸다. body에 file을 imageFile이라는 이름으로 담고
      console.log(fileUpload, "!!!!!!!!");
    } catch (error) {
      console.error(error, "이미지 업로드 실팽이팽이");
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      if (images.length + e.target.files.length > 5) {
        console.log("이미지를 5장 초과하여 업로드할 수 없습니다.");
        return;
      }
      //이미지 업로드 개수 제한있으니까 if문을 통해 이미지 개수 제한을 걸어둠

      console.log("!!!방금 업로드된 이미징", e.target.files.item(0)?.name);

      const fileName = e.target.files.item(0)!.name;
      //업로드한 이미지의 파일 이름만 따로 뽑음
      const imageFile = e.target.files.item(0);
      //이건 이미지 파일 자체를 뽑음
      const newImages = Array.from(e.target.files);
      //업로드하는 이미지 파일 자체들을 배열형태로 저장

      //서버에서 presignURL을 받아오는 코드
      const presignedURL = async (fileName: {
        name: string | number | boolean;
      }) => {
        let filename = encodeURIComponent(fileName.name);
        let res = await fetch(
          `${baseURL}/reviews/generate-presigned-url?fileName=${filename}&contentType=image/jpg`
        );
        res = await res.json();
        console.log(res);
      };

      console.log(presignedURL.msg, fileName);
      //실제 백엔드 API CALL 시에 넣어줄 링크 만드는 코드
      const imageURL = `https://asac-marketplace-s3.s3.ap-northeast-2.amazonaws.com/${fileName}`;

      console.log("!!!!!!!!!!!!!!!!!rrrrr", encodeURI(imageURL));

      // SETSTATE 함수 함수형 업데이트 활용
      // prevURLs은 PresignedURLs를 의미하고 전개연산자를 활용해서  presignedURL의 msg 프로퍼티를 PresignedURLs라는 배열내부에 삽입해줌.
      setPresignedURLs((prevURLs) => [...prevURLs, presignedURL.msg]);
      // prevURLs은 PresignedURLs를 의미하고 전개연산자를 활용해서  인코딩한  imageURL 객체를 ImageURLs라는 배열내부에 삽입해줌.
      //그리고 이 ImageURLs이라는 배열 데이터를  post 요청 시 body 에 넣어주는 것
      setImageURLs((prevURLs) => [...prevURLs, encodeURI(imageURL)]);

      console.log("Array.from(e.target.files)[0]: ", newImages[0]);

      //여긴 리액트 훅 폼인것 같은데 잘 모르겠음
      setValue("images", [...images, ...newImages]);
      setImagePreviews([
        ...imagePreviews,
        ...newImages.map((file: File) => URL.createObjectURL(file)),
      ]);
    }
    setIsImage(true);
  };

  //브라우저에 미리보기로 띄워진 이미지 제거 함수 (x버튼 누르는거)
  const removeImage = (index: number) => {
    setValue(
      "images",
      images.filter((_: any, i: number) => i !== index)
    );
    setImagePreviews(imagePreviews.filter((_: any, i: number) => i !== index));
  };

  //문의 등록 클릭 시 s3 에 실제로 업로드되는 코드 리액트 훅 폼의 속성을 이용해서 send를 콜백함수로 호출하는 듯 하다.
  const send = async (data: Record<string, any>) => {
    //form 요청 시 받아오는 data 기반으로 foreach 반복문 돌려서 uploadImage 함수 실행
    //data.image의 각각 file들을 매개변수로 넘겨줌
    data.images.forEach((file: File, index: number) => {
      console.log("인덱스", index);
      uploadImage(presignedURLs[index], file);
    });
    // prevURLs은 PresignedURLs를 의미하고 전개연산자를 활용해서  presignedURL의 msg 프로퍼티를 PresignedURLs라는 배열내부에 삽입해줌 이라고 설명하는 PresignedURLs 배열을 인덱스 돌려서 각각 uploadImage 함수를 실행해줌

    //post 요청 시 body에 넣을 데이터를 변수에 저장
    const reviewData = JSON.stringify({
      memberId: 1,
      inquiryType: "OTHER",
      title: "efewa",
      //문의 제목
      content: "testcontent",
      //문의 내용
      contactNumber: "000111111",
      notificationEnabled: true,
      imageUrls: imageURLs,
    });

    try {
      //실제 백엔드에 post 요청 call 맞나???
      // 일단 next 서버 단 api 주소로 post 요청 call하는 곳
      //위에 만든 reviewData를 body 에 담아서 요청
      const response = await fetch("/api/addInquiry", {
        method: "POST",
        body: reviewData,
      });
      // 에러 처리 추가
      router.push("/myPage");
      //ost 요청이 끝나면 myPage페이지로 이동
    } catch (error) {
      console.error("error fetching addinquiry ", error);
    }
  };

  return (
    <>
      <div className="h-full w-full p-4">
        <p className="pb-2 text-body-base">
          문의 유형<span className="text-red-600">*</span>
        </p>
        <AddInquiryTypeBox
          setIsBottomSheetOpen={setIsBottomSheetOpen}
          inquiryType={inquiryType}
        />
        <AddInquiryBottomSeat
          isBottomSheetOpen={isBottomSheetOpen}
          setIsBottomSheetOpen={setIsBottomSheetOpen}
          list={list}
          setInquiryType={setInquiryType}
        />
        <form onSubmit={handleSubmit(send)}>
          <p className="pb-2 text-body-base">
            문의 내용<span className="text-red-600">*</span>
          </p>
          <input
            {...register("title", { required: "제목을 입력해주세요" })}
            className="mb-4 h-12 w-full rounded-md border border-gray-300 p-2 text-sm focus:border-black focus:outline-0"
            type="text"
            placeholder="제목을 입력해주세요"
            name="title"
          />
          {errors.title && (
            <span>
              {typeof errors.title.message === "string"
                ? errors.title.message
                : "제목을 입력해주세요"}
            </span>
          )}
          <textarea
            {...register("content", {
              minLength: { value: 10, message: "최소 10자 이상 입력하세요" },
            })}
            className="h-26 mb-4 w-full rounded-md border border-gray-300 p-3 text-sm focus:border-black focus:outline-0"
            placeholder="문의하실 내용을 입력해주세요."
            name="content"
          />
          {errors.content && (
            <span>
              {typeof errors.content.message === "string"
                ? errors.content.message
                : "제목을 입력해주세요"}
            </span>
          )}

          <div className="">
            <div className="relative mb-4 h-20 w-20 rounded-md border-2">
              <input
                {...register("images")}
                type="file"
                id="file"
                name="cardImg"
                multiple
                accept="image/*"
                onChange={handleFileChange}
                className="h-full w-full border-2 opacity-0"
              ></input>
              <SvgIconPlusMono
                className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-gray-600"
                height={"1.5rem"}
                width={"1.5rem"}
              />
            </div>
            {isImage ? (
              <div className="flex gap-4">
                {imagePreviews.map((preview, index) => (
                  <div
                    className="relative mb-4 h-20 w-20 rounded-md border-2"
                    key={index}
                  >
                    <Image
                      className="h-full w-full rounded-md object-cover"
                      src={preview}
                      alt={`preview-${index}`}
                      width={80}
                      height={80}
                    />
                    <button
                      type="button"
                      className="absolute right-[-2px] top-[-2px] h-5 w-5 rounded-full bg-grayscale-300 text-body-min text-white"
                      onClick={() => removeImage(index)}
                    >
                      X
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              ""
            )}
          </div>
          <div className="text-xs text-grayscale-300">
            <p>30MB 이하의 이미지만 업로드 가능합니다.</p>
            <p>
              상품과 무관한 내용이거나 음란 및 불법적인 내용은 통보없이 삭제 될
              수 있습니다.
            </p>
            <p>사진은 최대 8장 등록 가능합니다.</p>
          </div>

          <div className="fixed bottom-0 left-1/2 h-20 w-96 -translate-x-1/2 bg-white p-4">
            <Button type="submit" variant={"primary"} className="h-full w-full">
              등록하기
            </Button>
          </div>
        </form>
      </div>
    </>
  );
}
```

벨라가 준 코드 복붙수준이긴하지만 나름대로 코드를 분석해보았다.

일단 이미지 불러오기 실패한 이유는 form 데이터형식으로 presignURL을 formdata형식으로 바꾸면 안되고 file 자체를 put 요청할 때 body 에 넣어줘야했기 때문이었다.

코드가 너무 복잡해서 정리 못하겠다. 알아서 잘 읽어보자.

끝난 것 같지만 아직 끝나지 않았다.

presignedURL을 못 불러오는 에러가 발생햇다.

![alt text](/image/image-22.png)

이미지 URL을 받아 화면에 렌더링하는 코드는 잘 실행됐지만

위 빨간줄 그은 undefined가 문제였다.

`console.log(presignedURL.msg, fileName)`

이 콘솔이 저 빨간줄과 파일이름이 출력하는건데

지금 파일이름만 나오고 presignedURL이 출력되지 않고있다.

즉 백엔드 서버로 요청을 보냈는지 안보냈는진 모르겠지만 아무튼 프론트엔으로 presignedURL을 받아오지 못했다는 뜻이다.

원인이 뭔지 생각해보니

```jsx
const presignedURL = async (fileName: { name: string | number | boolean }) => {
  let filename = encodeURIComponent(fileName.name);
  let res = await fetch(
    `${baseURL}/reviews/generate-presigned-url?fileName=${filename}&contentType=image/jpg`
  );
  res = await res.json();
  console.log(res);
};

console.log(presignedURL.msg, fileName);
//실제 백엔드 API CALL 시에 넣어줄 링크 만드는 코드
const imageURL = `https://asac-marketplace-s3.s3.ap-northeast-2.amazonaws.com/${fileName}`;
```

위 코드를 보면 `presignedURL` 함수의 return 값이 없다. 즉 반환값이 없는데 `presignedURL.msg` 가 존재할리가 없다.

```jsx
const presignedURL = async (fileName: { name: string | number | boolean }) => {
  let filename = encodeURIComponent(fileName.name);
  let res = await fetch(
    `${baseURL}/reviews/generate-presigned-url?fileName=${filename}&contentType=image/jpg`
  );
  res = await res.json();
  console.log(res);
  return res;
};
```

반환값을 부여하고 다시 실행했지면

![alt text](/image/image-23.png)

여전히 presignedURL을 불러오지 못했다. 이유가 뭘까??

열심히 고민해본 결과 await를 넣지않아 생긴 문제였다.

항상 서버에서 데이터를 불러올때는 await를 넣어줘야한다. 시간이 얼마나 걸릴 지 알 수 없기 때문에

await를 주지않으면 데이터를 다 불러오지도 않았는데 코드를 바로 읽어버리기 때문이다.

```jsx
     //서버에서 presignURL을 받아오는 코드
      const getPresignedURL = async (fileName: { name: string | number | boolean }) => {
        let filename = encodeURIComponent(fileName)
        let res = await fetch(`${baseURL}/reviews/generate-presigned-url?fileName=${filename}&contentType=image/jpg`)
        res = await res.json()
        console.log(res)
        return res
      }

      console.log('!!!방금 업로드된 이미징', e.target.files.item(0)?.name)

      const fileName = e.target.files.item(0)!.name
      //업로드한 이미지의 파일 이름만 따로 뽑음
      const imageFile = e.target.files.item(0)
      //이건 이미지 파일 자체를 뽑음
      const newImages = Array.from(e.target.files)
      //업로드하는 이미지 파일 자체들을 배열형태로 저장

      const presignedURL = await getPresignedURL(fileName)
//await를 준 getPresignedURL() 함수를 presignedURL 객체에 저장


//presignedURL 객체를 호출
      console.log(presignedURL.msg, fileName)
      //실제 백엔드 API CALL 시에 넣어줄 링크 만드는 코드
```

다음과 같이 코드를 수정하고 이미지 업로드 재시도 결과

![alt text](/image/image-24.png)

presignedURL을 성공적으로 불러왔다!!

이제 문의사항 폼을 작성하고 제출을 누르면

![alt text](/image/image-25.png)

진짜진짜 성공했다. 야호!!

S3에 실제로 업로드 되었는지 확인해보자

![alt text](/image/image-26.png)


잘 작동한다!!

최종 코드

```jsx
'use client'

import Image from 'next/image'
import { useRouter } from 'next/navigation'
import React, { useState } from 'react'
import { useForm } from 'react-hook-form'

import { baseURL } from '@/api/util/instance'
import AddInquiryBottomSeat from '@/components/feature/addInquiry/AddInquiryBottomSeat'
import AddInquiryTypeBox from '@/components/feature/addInquiry/AddInquiryTypeBox'
import SvgIconPlusMono from '@/components/icons/icon-plus-mono'
import { Button } from '@/components/ui/button'

export default function page() {
  const [isBottomSheetOpen, setIsBottomSheetOpen] = useState(false)
  const list = ['불만', '가득', '이게 나라냐 ']
  const [inquiryType, setInquiryType] = useState(list[0])
  const router = useRouter()
  const [isImage, setIsImage] = useState(false)

  const [imagePreviews, setImagePreviews] = useState<string[]>([])
  const [presignedURLs, setPresignedURLs] = useState<string[]>([])
  const [imageURLs, setImageURLs] = useState<string[]>([])

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm()

  const images = watch('images', [])

  const uploadImage = async (presignedURL: string, imageFile: File | null) => {
    try {
      const fileUpload = await fetch(presignedURL, {
        method: 'PUT',
        body: imageFile,
      })
      //presignedURLs라는 배열 내부 요소들을 presignedURL이라 지정하고 그 주소에 put 요청을 보낸다. body에 file을 imageFile이라는 이름으로 담고
      console.log(fileUpload, '!!!!!!!!')
    } catch (error) {
      console.error(error, '이미지 업로드 실팽이팽이')
    }
  }

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      if (images.length + e.target.files.length > 5) {
        console.log('이미지를 5장 초과하여 업로드할 수 없습니다.')
        return
      }
      //이미지 업로드 개수 제한있으니까 if문을 통해 이미지 개수 제한을 걸어둠

      //서버에서 presignURL을 받아오는 코드
      const getPresignedURL = async (fileName: { name: string | number | boolean }) => {
        let filename = encodeURIComponent(fileName)
        let res = await fetch(`${baseURL}/reviews/generate-presigned-url?fileName=${filename}&contentType=image/jpg`)
        res = await res.json()
        console.log(res)
        return res
      }

      console.log('!!!방금 업로드된 이미징', e.target.files.item(0)?.name)

      const fileName = e.target.files.item(0)!.name
      //업로드한 이미지의 파일 이름만 따로 뽑음
      const imageFile = e.target.files.item(0)
      //이건 이미지 파일 자체를 뽑음
      const newImages = Array.from(e.target.files)
      //업로드하는 이미지 파일 자체들을 배열형태로 저장

      const presignedURL = await getPresignedURL(fileName)



      console.log(presignedURL.msg, fileName)
      //실제 백엔드 API CALL 시에 넣어줄 링크 만드는 코드
      const imageURL = `https://asac-marketplace-s3.s3.ap-northeast-2.amazonaws.com/${fileName}`

      console.log('!!!!!!!!!!!!!!!!!rrrrr', encodeURI(imageURL))

      // SETSTATE 함수 함수형 업데이트 활용
      // prevURLs은 PresignedURLs를 의미하고 전개연산자를 활용해서  presignedURL의 msg 프로퍼티를 PresignedURLs라는 배열내부에 삽입해줌.
      setPresignedURLs((prevURLs) => [...prevURLs, presignedURL.msg])
      // prevURLs은 PresignedURLs를 의미하고 전개연산자를 활용해서  인코딩한  imageURL 객체를 ImageURLs라는 배열내부에 삽입해줌.
      //그리고 이 ImageURLs이라는 배열 데이터를  post 요청 시 body 에 넣어주는 것
      setImageURLs((prevURLs) => [...prevURLs, encodeURI(imageURL)])

      console.log('Array.from(e.target.files)[0]: ', newImages[0])

      //여긴 리액트 훅 폼인것 같은데 잘 모르겠음
      setValue('images', [...images, ...newImages])
      setImagePreviews([...imagePreviews, ...newImages.map((file: File) => URL.createObjectURL(file))])
    }
    setIsImage(true)
  }

  //브라우저에 미리보기로 띄워진 이미지 제거 함수 (x버튼 누르는거)
  const removeImage = (index: number) => {
    setValue(
      'images',
      images.filter((_: any, i: number) => i !== index),
    )
    setImagePreviews(imagePreviews.filter((_: any, i: number) => i !== index))
  }

  //문의 등록 클릭 시 s3 에 실제로 업로드되는 코드 리액트 훅 폼의 속성을 이용해서 send를 콜백함수로 호출하는 듯 하다.
  const send = async (data: Record<string, any>) => {
    //form 요청 시 받아오는 data 기반으로 foreach 반복문 돌려서 uploadImage 함수 실행
    //data.image의 각각 file들을 매개변수로 넘겨줌
    data.images.forEach((file: File, index: number) => {
      console.log('인덱스', index)
      uploadImage(presignedURLs[index], file)
    })
    // prevURLs은 PresignedURLs를 의미하고 전개연산자를 활용해서  presignedURL의 msg 프로퍼티를 PresignedURLs라는 배열내부에 삽입해줌 이라고 설명하는 PresignedURLs 배열을 인덱스 돌려서 각각 uploadImage 함수를 실행해줌

    //post 요청 시 body에 넣을 데이터를 변수에 저장
    const reviewData = JSON.stringify({
      memberId: 1,
      inquiryType: 'OTHER',
      title: 'efewa',
      //문의 제목
      content: 'testcontent',
      //문의 내용
      contactNumber: '000111111',
      notificationEnabled: true,
      imageUrls: imageURLs,
    })

    try {
      //실제 백엔드에 post 요청 call 맞나???
      // 일단 next 서버 단 api 주소로 post 요청 call하는 곳
      //위에 만든 reviewData를 body 에 담아서 요청
      const response = await fetch('/api/addInquiry', {
        method: 'POST',
        body: reviewData,
      })
      // 에러 처리 추가
      router.push('/myPage')
      //ost 요청이 끝나면 myPage페이지로 이동
    } catch (error) {
      console.error('error fetching addinquiry ', error)
    }
  }

  return (
    <>
      <div className="h-full w-full p-4">
        <p className="pb-2 text-body-base">
          문의 유형<span className="text-red-600">*</span>
        </p>
        <AddInquiryTypeBox setIsBottomSheetOpen={setIsBottomSheetOpen} inquiryType={inquiryType} />
        <AddInquiryBottomSeat
          isBottomSheetOpen={isBottomSheetOpen}
          setIsBottomSheetOpen={setIsBottomSheetOpen}
          list={list}
          setInquiryType={setInquiryType}
        />
        <form onSubmit={handleSubmit(send)}>
          <p className="pb-2 text-body-base">
            문의 내용<span className="text-red-600">*</span>
          </p>
          <input
            {...register('title', { required: '제목을 입력해주세요' })}
            className="mb-4 h-12 w-full rounded-md border border-gray-300 p-2 text-sm focus:border-black focus:outline-0"
            type="text"
            placeholder="제목을 입력해주세요"
            name="title"
          />
          {errors.title && (
            <span>{typeof errors.title.message === 'string' ? errors.title.message : '제목을 입력해주세요'}</span>
          )}
          <textarea
            {...register('content', {
              minLength: { value: 10, message: '최소 10자 이상 입력하세요' },
            })}
            className="h-26 mb-4 w-full rounded-md border border-gray-300 p-3 text-sm focus:border-black focus:outline-0"
            placeholder="문의하실 내용을 입력해주세요."
            name="content"
          />
          {errors.content && (
            <span>{typeof errors.content.message === 'string' ? errors.content.message : '제목을 입력해주세요'}</span>
          )}

          <div className="">
            <div className="relative mb-4 h-20 w-20 rounded-md border-2">
              <input
                {...register('images')}
                type="file"
                id="file"
                name="cardImg"
                multiple
                accept="image/*"
                onChange={handleFileChange}
                className="h-full w-full border-2 opacity-0"
              ></input>
              <SvgIconPlusMono
                className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-gray-600"
                height={'1.5rem'}
                width={'1.5rem'}
              />
            </div>
            {isImage ? (
              <div className="flex gap-4">
                {imagePreviews.map((preview, index) => (
                  <div className="relative mb-4 h-20 w-20 rounded-md border-2" key={index}>
                    <Image
                      className="h-full w-full rounded-md object-cover"
                      src={preview}
                      alt={`preview-${index}`}
                      width={80}
                      height={80}
                    />
                    <button
                      type="button"
                      className="absolute right-[-2px] top-[-2px] h-5 w-5 rounded-full bg-grayscale-300 text-body-min text-white"
                      onClick={() => removeImage(index)}
                    >
                      X
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              ''
            )}
          </div>
          <div className="text-xs text-grayscale-300">
            <p>30MB 이하의 이미지만 업로드 가능합니다.</p>
            <p>상품과 무관한 내용이거나 음란 및 불법적인 내용은 통보없이 삭제 될 수 있습니다.</p>
            <p>사진은 최대 8장 등록 가능합니다.</p>
          </div>

          <div className="fixed bottom-0 left-1/2 h-20 w-96 -translate-x-1/2 bg-white p-4">
            <Button type="submit" variant={'primary'} className="h-full w-full">
              등록하기
            </Button>
          </div>
        </form>
      </div>
    </>
  )
}

```
