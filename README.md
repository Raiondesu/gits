# gits

> A prototype of a cli-tool for efficient submodules management

Config format for submodules:
```json
{
  "name": "MyModule",
  "version": "1.0.0", // or commit hash or git tag
  "dependencies": {
    "ModuleName": "1.0.0" // or commit hash or git tag
    // ... other deps
  }
}
```
