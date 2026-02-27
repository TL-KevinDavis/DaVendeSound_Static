import { apply, applyTemplates, chain, externalSchematic, mergeWith, move, Rule, SchematicContext, strings, Tree, url } from '@angular-devkit/schematics';
import { parseName } from '@schematics/angular/utility/parse-name';
import { buildDefaultPath } from '@schematics/angular/utility/project';
import { getWorkspace } from '@schematics/angular/utility/workspace';

export default function (options: any): Rule {
  return (tree: Tree, context: SchematicContext) => {
    const workspace = getWorkspace(tree);
    const project = workspace.projects.get(options.project);
    const defaultPath = buildDefaultPath(project);
    const parsedPath = parseName(defaultPath, options.name);
    options.name = parsedPath.name;
    options.path = parsedPath.path;
    options.selector = options.selector || `app-${options.name}`;

    const templateSource = apply(url('./files'), [
      applyTemplates({
        ...strings,
        ...options,
        'if-flat': (s: string) => options.flat ? '' : s,
      }),
      move(parsedPath.path),
    ]);

    const rule = chain([
      mergeWith(templateSource),
      options.skipTests ? Rule() : externalSchematic('@schematics/angular', 'spec', {
        name: options.name,
        path: options.path,
        project: options.project,
        flat: options.flat,
        type: 'component',
      }),
    ]);

    return rule(tree, context);
  };
}
