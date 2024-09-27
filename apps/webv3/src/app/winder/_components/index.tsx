import { Button } from "@tape.xyz/winder";
import { Heart, PlusCircle, Trash } from "@tape.xyz/winder/common";

export const components = [
  {
    id: "avatar",
    label: "Avatar",
    component: () => {
      return <div>Avatar</div>;
    }
  },
  {
    id: "button",
    label: "Button",
    component: () => {
      return (
        <div className="flex flex-col gap-4">
          <div className="flex justify-between gap-2">
            <Button size="icon">
              <Heart className="size-5" />
            </Button>
            <Button size="icon" variant="secondary">
              <Heart className="size-5" />
            </Button>
            <Button size="icon" variant="destructive">
              <Heart className="size-5" />
            </Button>
          </div>
          <div className="flex items-center justify-between gap-2">
            <Button size="sm" className="w-28">
              Upload
            </Button>
            <Button size="md" className="w-28" variant="secondary">
              Upload
            </Button>
            <Button size="lg" className="w-28" variant="destructive">
              Upload
            </Button>
          </div>
          <div className="flex justify-between gap-2">
            <Button className="w-28">Upload</Button>
            <Button className="w-28" variant="secondary">
              Upload
            </Button>
            <Button className="w-28" variant="destructive">
              Upload
            </Button>
          </div>
          <div className="flex justify-between gap-2">
            <Button className="w-28" loading={true}>
              Upload
            </Button>
            <Button className="w-28" variant="secondary" loading={true}>
              Upload
            </Button>
            <Button className="w-28" variant="destructive" loading={true}>
              Upload
            </Button>
          </div>
          <div className="flex items-center justify-between gap-2">
            <Button className="w-28">
              <span>Upload</span>
              <PlusCircle className="size-5" />
            </Button>
            <Button className="w-28" variant="secondary">
              <span>Upload</span>
              <PlusCircle className="size-5" />
            </Button>
            <Button className="w-28" variant="destructive">
              <span>Delete</span>
              <Trash className="size-5" />
            </Button>
          </div>
        </div>
      );
    }
  },
  {
    id: "card",
    label: "Card",
    component: () => {
      return <div>Card</div>;
    }
  },
  {
    id: "description",
    label: "Description",
    component: () => {
      return <div>Description</div>;
    }
  },
  {
    id: "dropdown",
    label: "Dropdown",
    component: () => {
      return <div>Dropdown</div>;
    }
  },
  {
    id: "empty-state",
    label: "Empty State",
    component: () => {
      return <div>Empty State</div>;
    }
  },
  {
    id: "floating-nav",
    label: "Floating Nav",
    component: () => {
      return <div>Floating Nav</div>;
    }
  },
  {
    id: "input",
    label: "Input",
    component: () => {
      return <div>Input</div>;
    }
  },
  {
    id: "modal",
    label: "Modal",
    component: () => {
      return <div>Modal</div>;
    }
  },
  {
    id: "popover",
    label: "Popover",
    component: () => {
      return <div>Popover</div>;
    }
  },
  {
    id: "select",
    label: "Select",
    component: () => {
      return <div>Select</div>;
    }
  },
  {
    id: "spinner",
    label: "Spinner",
    component: () => {
      return <div>Spinner</div>;
    }
  },
  {
    id: "switch",
    label: "Switch",
    component: () => {
      return <div>Switch</div>;
    }
  },
  {
    id: "tabs",
    label: "Tabs",
    component: () => {
      return <div>Tabs</div>;
    }
  },
  {
    id: "text",
    label: "Text",
    component: () => {
      return <div>Text</div>;
    }
  },
  {
    id: "textarea",
    label: "Textarea",
    component: () => {
      return <div>Textarea</div>;
    }
  },
  {
    id: "theme-switcher",
    label: "Theme Switcher",
    component: () => {
      return <div>Theme Switcher</div>;
    }
  },
  {
    id: "toast",
    label: "Toast",
    component: () => {
      return <div>Toast</div>;
    }
  },
  {
    id: "tooltip",
    label: "Tooltip",
    component: () => {
      return <div>Tooltip</div>;
    }
  }
];
