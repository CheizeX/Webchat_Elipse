declare const processEnv: {
  mainColor: string;
  secondaryColor: string;
  name: string;
  description: string;
  avatar: string;
  socketUrl: string;
  restUrl?: string;
  animation?: string;
  companyId?: string;
};
declare module '*.svg' {
  const content: any;
  export default content;
}
declare module '*.png' {
  const content: any;
  export default content;
}
