import * as fs from 'https://deno.land/std@0.176.0/fs/mod.ts';

type PartialModel = {
  textures: Record<string, string>
}

const getModelFiles = () => {
  const models = new Map<string, PartialModel>();
  for (const file of fs.expandGlobSync('./pack/assets/minecraft/models/**/*.json')) {
    models.set(
      file.path,
      JSON.parse(
        Deno.readTextFileSync(file.path)
      ) as PartialModel
    );
  }

  return models;
}

const resolvePath = (nonResolvedPath: string) => {
  const parsed = nonResolvedPath.match(/(?:(?<namespace>\w+)\:)?(?<path>.+)/);

  if (!parsed) throw new Error(`Path (${nonResolvedPath}) is invalid`);

  return {
    namespace: parsed?.groups?.namespace,
    path: parsed?.groups?.path || ''
  };
}

const stringifyPath = (parsedPath: {
  namespace?: string,
  path: string
}) => `${parsedPath.namespace ? parsedPath.namespace+':' : ''}${parsedPath.path}`

let count = 0;
for (const [filepath, model] of getModelFiles().entries()) {
  let anyChanges = false;

  if (model.textures) for (const [key, nonResolvedPath] of Object.entries(model.textures)) {
    const texture = resolvePath(nonResolvedPath);
    
    if (
      texture.path.startsWith('item')
      || texture.path.startsWith('block')
      || texture.path.startsWith('#')) continue;

    anyChanges = true;
    console.log();

    model.textures[key] = stringifyPath({
      ...texture,
      path: 'item/' + texture.path
    });

    count++;
  }

  if (anyChanges) {
    console.log(`Fixed: ${filepath}`)

    Deno.writeTextFileSync(filepath,
      JSON.stringify(
        model,
        void 0,
        '\t'
      )
    )
  }

}