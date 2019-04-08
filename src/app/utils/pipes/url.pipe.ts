import { Pipe, PipeTransform } from "@angular/core";
import { UrlSegment } from "@angular/router";

@Pipe({ name: "urlConnect" })
export class UrlConnectPipe implements PipeTransform {
  transform(value?: UrlSegment[]): string {
    if (!value) return "";
    return value.join("/");
  }
}
