import React from 'react'
import {Button}from "@/components/ui/button";

export default function SwitchCameraView({children, tb, onClick}) {

  return (
    <Button onClick={onClick}>{children}</Button>
  )
}
