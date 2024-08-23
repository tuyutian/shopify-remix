import {Button, Input, Select, SelectItem, Textarea} from "@nextui-org/react";
import React, {useCallback, useEffect, useMemo, useRef, useState} from "react";
import type {MetaFunction} from "@remix-run/react";
import { useActionData,Form,useSubmit,useNavigation} from "@remix-run/react";

import type {ActionFunctionArgs} from "@remix-run/node";
import {json} from "@remix-run/node";
import type {SubmitTarget} from "react-router-dom/dist/dom";

export const meta: MetaFunction = () => {
  return [
    { title: "Feedback" },
    {
      property: "og:title",
      content: "Feedback",
    },
    {
      name: "description",
      content: "TrackingMore Feedback",
    },
  ];
};

export const action = async ({
                               request,
                             }: ActionFunctionArgs) => {
  const formData:FormData = await request.formData();
  const email = formData.get('email') ?? '';
  const shopName = formData.get('shopName') ?? '';
  const feedbackType = formData.get('feedbackType') ??"0";
  let comment = formData.get('comment') ?? '';

  if (!feedbackType || !comment) {
    return json({ error: 'Feedback type and comment are required.' }, { status: 400 });
  }

  try {
    if (shopName) {
      comment = `Shop Name: ${shopName}.myshopify.com \n".${comment}`;
    }
    await prisma.feedback.create({
      data:{
        email,
        type:(typeof feedbackType === "string") ? parseInt(feedbackType) :feedbackType,
        star:3,
        message:comment,
      }
    })
    return json({ message: 'Submit successful!' }, { status: 200 });
  } catch (error) {
    return json({ error: 'Internal server error.' }, { status: 500 });
  }
};

export default function Feedback() {
  const data = useActionData<typeof action>();
  console.log(data);
  const [feedbackType, setFeedbackType] = useState<undefined | string>(undefined);
  const [comment, setComment] = useState<undefined | string>(undefined);
  const [submitSuccess, setSubmitSuccess] = useState(true);
  const [email, setEmail] = useState("");
  const [shopName, setShopName] = useState("");
  const submit = useSubmit();
  const [feedbackTypeError, setFeedbackTypeError] = useState(false);
  const [commentError, setCommentError] = useState(false);
  const navigation = useNavigation();

  const optionList = [
    "Feature Request",
    "Bug Report",
    "Performance",
    "App Compatibility",
    "Service",
    "Other",
  ];

  const isFeedbackTypeValid = useMemo(() => feedbackType !== undefined && feedbackType !== "", [feedbackType]);
  const isCommentValid = useMemo(() => comment !== undefined && comment !== "", [comment]);
  const isSubmitting = navigation.state === 'loading' || navigation.state === 'submitting';
  let formRef = useRef();
  let isAdding = navigation.state==="submitting"&&navigation.formData?.get("_action")==="create"

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    console.log(isFeedbackTypeValid);
    if (!isFeedbackTypeValid) {
      setFeedbackTypeError(true);
      return;
    }
    if (!isCommentValid) {
      setCommentError(true);
      return;
    }
    submit(e.currentTarget as SubmitTarget);

  }, [isCommentValid, isFeedbackTypeValid, submit]);
  useEffect(() => {
    if (!isAdding) {
      formRef.current?.reset()
    }
  }, [isAdding]);
  return <div className="container max-w-[950px] mx-auto p-4">
    <div className="md:w-2/3 sm:w-full flex flex-col gap-3 items-start">
      {data?.message&&submitSuccess ? <div
        className="flex items-center max-md:flex-col bg-[#cdfee1] px-6 py-3.5 rounded font-[sans-serif] w-full">
        <p className="text-base flex-1">Thanks for your feedback</p>
        <div onClick={()=>setSubmitSuccess(false)} className="max-md:mt-4">
          <svg viewBox="0 0 20 20" className="w-6 cursor-pointer  inline-block">
            <path
              d="M12.72 13.78a.75.75 0 1 0 1.06-1.06l-2.72-2.72 2.72-2.72a.75.75 0 0 0-1.06-1.06l-2.72 2.72-2.72-2.72a.75.75 0 0 0-1.06 1.06l2.72 2.72-2.72 2.72a.75.75 0 1 0 1.06 1.06l2.72-2.72 2.72 2.72Z" />
          </svg>
        </div>
      </div>:""}
      <p>Your feedback means A LOT to us! Thank you</p>
      <Form ref={formRef} onSubmit={handleSubmit} method="post" className="w-full ">
        <input type="hidden" name="_action" value="create" />
        <Input
          autoComplete="on"
          value={email}
          type="email"
          name="email"
          onValueChange={(value)=>setEmail(value)}
          validate={(val=> {
            if (val.length<=0) {
              return true
            }
            return /^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/.test(val) ?true: "Invalid email";
          })}
          errorMessage="Invalid email"
          variant="bordered"
          label="Email Address"
          className="w-full"
        />
        <Input
          autoComplete="on"
          type="text"
          value={shopName}
          name="shopName"
          errorMessage="test"
          onValueChange={(value)=>setShopName(value)}
          variant="bordered"
          label="Shop Name"
          className="w-full"
          endContent={
            <div className="pointer-events-none flex items-center">
              <span className="text-default-400 ">.myshopify.com</span>
            </div>
          }
        />
        <Select  name="feedbackType" variant="bordered" isRequired label="Feedback Type" errorMessage="Select feedback type."
                onChange={(e) => {
                  setFeedbackType(e.target.value);
                }} isInvalid={!isFeedbackTypeValid&&feedbackTypeError} value={feedbackType}>
          {optionList.map((label, index) => (
            <SelectItem key={index} value={index}>
              {label}
            </SelectItem>
          ))}
        </Select>
        <Textarea name="comment" isRequired label="Comment" onChange={(e) => {
          setComment(e.target.value);
        }} isInvalid={!isCommentValid&&commentError} errorMessage="Enter a comment." />

        <Button color="primary" isLoading={isSubmitting}  type="submit"
                disabled={isSubmitting}>
          Submit
        </Button>
      </Form>
    </div>
  </div>;
}
