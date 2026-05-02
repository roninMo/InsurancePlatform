import { useContext, useMemo, useRef, useState } from "react";
import { Select, SelectItem } from "@Project/ReactComponents";
import { TooltipService } from "@Project/ReactComponents";
import { Alert, AlertType } from "../../../../../Components/Content/Alert/Alert";
import { Card } from "../../../../../Components/Content/Card/Card";


export const Example_Alert = ({ type }: {
  type: AlertType
}) => {
  const alertType: AlertType = type || 'info';
  const additionalStyles = ``;

  return (
    <div>
      <Alert type={type} additCStyles={additionalStyles}>
        This is an alert notification element.
      </Alert>
    </div>
  );
}


export const Example_AllAlerts = () => {

  return (
    <div className='spacing py-2'>
      <Alert type="info" additCStyles="span-12 lg:span-6">
        This is an alert notification element.
      </Alert>
      
      <Alert type="warning" additCStyles="span-12 lg:span-6">
        This is an alert notification element.
      </Alert>
      
      <Alert type="error" additCStyles="span-12 lg:span-6">
        This is an alert notification element.
      </Alert>
      
      <Alert type="ok" additCStyles="span-12 lg:span-6">
        This is an alert notification element.
      </Alert>
      
      <div className='span-12 lg:span-3' />
      <Alert type="question" additCStyles="span-12">
        This is an alert notification element.
      </Alert>
      <div className='span-12 lg:span-3' />

      <Alert type="info" additCStyles='span-12 p-4'>
        <div className='card-layouts spacing'>
          <span className="span-12 pb-2 italic placeholder-text text-sm">This is another notification element</span>
          <Card
            type='card-link' 
            title='Card Link Layout'
            description='The description of a card link element'
            additStyles='span-12 lg:span-6 p-4' noBackground
            linkText='Card link' onClickLink={() => {}}
            hoverTheme
          >
            <div>Card link content</div>
            <div>Card link content</div>
          </Card>
          
          <Card
            type='card-link' 
            title='Card Link Layout'
            description='The description of a card link element'
            additStyles='span-12 lg:span-6 p-4'
            linkText='Card link' onClickLink={() => {}}
            hoverTheme
          >
            <div>Card link content</div>
            <div>Card link content</div>
          </Card>
        </div>
      </Alert>
    </div>
  );
}
