import { Icon } from "@Project/ReactComponents";


export const Example_Icon = () => {
  // You can add your own dynamic styles to each variant

  return (
    <div className="span-12 rowStart gap-2">
      <Icon variant="OutlineInfo" styles="i-default-theme size-9 theme-fa" />
      <div className="p-2 text-base text-colors">
        Select your variant and add your custom styling to them. They're made easy to add with minimal code.
      </div>
    </div>
  );
}
