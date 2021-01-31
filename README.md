# Iskra language playground

Iskra is pronounced /i'skrʌ/ and means "spark" in Russian.

https://iskra-playground.vercel.app/

## Repository

- `src`: Iskra compiler source
- `site`: Iskra playground website source

## Grammar

```
command := repeat | motion
repeat := 'repeat' INT '(' command ')'
motion := ('turn' | 'forward') INT
```
