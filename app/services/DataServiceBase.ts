import toast from "react-hot-toast";
import observableService from "./observableService";

export abstract class DataServiceBase {
  protected async executeOperation<T>(
    operation: () => Promise<T | null>,
    rollback: (beforeData: any) => void = () => {},
    errorMessage: string = "An error occured"
  ): Promise<T | null> {
    const beforeData = observableService.getCurrentData();
    try {
      const result = await operation();
      return result;
    } catch (error) {
      console.error(errorMessage, error);
      observableService.updateAppData(beforeData);
      toast.error(errorMessage, { duration: 2000 });
      rollback(beforeData);
      return null;
    }
  }
}
