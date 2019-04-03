export interface IErrorState {
  error: boolean;
  errorMessage: string | null | undefined;
}

export const InitialErrorState: IErrorState = {
  error: false,
  errorMessage: null
};
