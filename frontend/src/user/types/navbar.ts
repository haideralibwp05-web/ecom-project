export interface NavbarTypes {
  label?: string;
  signupLink?: string;
  crossIcon?: string;
  logo?: string;

  navlinks?: {
    id: number;
    label: string;
    url: string;
    dropdown?: {
      id: number;
      label: string;
      url: string;
    }[];
  }[];

  Searchinput?: {
    searchIcon: string;
    Placeholder: string;
  };

  NavIcons?: {
    id: number;
    icon: string;
    url: string;
  }[];
}