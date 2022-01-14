import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'variationName',
})
export class VariationNamePipe implements PipeTransform {
  transform(recipe: any, id: any): unknown {
    recipe = recipe.filter((obj) => {
      return obj.id == id && obj.name.toLowerCase() != "dummy"
    });
    return recipe[0];
  }
}
