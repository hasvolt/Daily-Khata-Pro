with open('studio-daily-khata-pro/schemaTypes/index.ts', 'w') as f:
    f.write("""import post from './post'
import author from './author'

export const schemaTypes = [post, author]
""")
print("Written!")
