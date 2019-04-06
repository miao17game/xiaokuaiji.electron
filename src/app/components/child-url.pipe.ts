import { Pipe, PipeTransform } from "@angular/core";

@Pipe({ name: "childUrl" })
export class ChildUrlPipe implements PipeTransform {
  transform(url: string, parent = "/"): string {
    if (!url) return "";
    if (url.startsWith(parent)) {
      return url.substring(parent.length + 1);
    }
    return url;
  }
}
