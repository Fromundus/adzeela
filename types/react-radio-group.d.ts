// src/types/react-radio-group.d.ts

declare module "react-radio-group" {
    import { Component, ReactNode } from "react";
  
    export interface RadioGroupProps {
      name?: string;
      selectedValue?: string;
      onChange?: (value: string) => void;
      children?: ReactNode;
    }
  
    export class RadioGroup extends Component<RadioGroupProps> {}
  
    export interface RadioProps {
      value: string;
      children?: ReactNode;
    }
  
    export class Radio extends Component<RadioProps> {}
  }
  