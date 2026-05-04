import { Card } from "../../../../../Components/Content/Card/Card";


export const Example_DefaultCard = () => {

  return (
    <div className="spacing">
      <Card type="default" additStyles="span-12 lg:span-4 p-4">
        Default layout
      </Card>

      <Card type="default" additStyles="span-12 lg:span-4 p-4" noBorder noBackground>
        Default layout
      </Card>

      <Card type="default" additStyles="span-12 lg:span-4 p-4" noBackground>
        Default layout
      </Card>

      {/* Interactive hover */}
      <Card type="default" additStyles="span-12 lg:span-4 p-4" hoverTheme>
        Default layout
      </Card>

      <Card type="default" additStyles="span-12 lg:span-4 p-4" noBorder noBackground hoverTheme>
        Default layout
      </Card>

      <Card type="default" additStyles="span-12 lg:span-4 p-4" noBackground hoverTheme>
        Default layout
      </Card>
    </div>
  );
}


export const Example_Card = () => {

  return (
    <div className="spacing">
      <Card
        type="card" 
        title="Card Layout"
        description="The description of a card style element"

        hoverTheme 
        additStyles="span-12 lg:span-4 p-4"
      >
        <div>Card content</div>
        <div>Card content</div>
      </Card>

      <Card
        type="card" 
        title="Card Layout"
        description="The description of a card style element" 

        noBackground hoverTheme 
        additStyles="span-12 lg:span-4 p-4" 
      >
        <div>Card content</div>
        <div>Card content</div>
      </Card>

      <Card
        type="card" 
        title="Card Layout"
        description="The description of a card style element"

        noBorder noBackground hoverTheme 
        additStyles="span-12 lg:span-4 p-4" 
      >
        <div>Card content</div>
        <div>Card content</div>
      </Card>
    </div>
  );
}


export const Example_CardButton = () => {

  return (
    <div className="spacing">
      <Card
        type='card-button' 
        title='Card Button Layout'
        description='The description of a card button element.'
        additStyles='span-12 lg:span-6 p-4'
        buttonProps={{displayText: 'Create', onClick: () => {}}}
        hoverTheme focusTheme
        >
        <div>Card button content</div>
        <div>Card button content</div>
      </Card>
      
      <Card
        type='card-button' 
        title='Card Button Layout'
        description='The description of a card button element.'
        additStyles='span-12 lg:span-6 p-4' noBackground
        buttonProps={{displayText: 'Create', onClick: () => {}}}
        hoverTheme focusTheme
        >
        <div>Card button content</div>
        <div>Card button content</div>
      </Card>
    </div>
  );
}


export const Example_CardLink = () => {

  return (
    <div className="spacing">
      <Card
        type='card-link' 
        title='Card Link Layout'
        description='The description of a card link element.'
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
        description='The description of a card link element.'
        additStyles='span-12 lg:span-6 p-4'
        linkText='Card link' onClickLink={() => {}}
        hoverTheme
      >
        <div>Card link content</div>
        <div>Card link content</div>
      </Card>
    </div>
  );
}
