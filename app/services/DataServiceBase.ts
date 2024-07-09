import observableService from "./observableService";

export abstract class DataServiceBase {
  protected async executeOperation<T>(
    operation: () => Promise<T | null>,
    rollback: (beforeData: any) => void = () => {}
  ): Promise<T | null> {
    const beforeData = observableService.getCurrentData();
    try {
      const result = await operation();
      return result;
    } catch (error) {
      console.error("Error executing operation:", error);
      observableService.updateAppData(beforeData);
      rollback(beforeData);
      return null;
    }
  }
}
