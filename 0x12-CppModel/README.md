# C++ Modules (00-09)

comprehensive journey through c++ programming from basic syntax to advanced concepts including oop, polymorphism, templates, stl containers, and algorithm design.    part of 42 school curriculum.

**timeline**: july 2, 2024 - december 18, 2024 (139 days, ~5.5 months)

## module timeline

| module | dates | duration | topics |
|--------|-------|----------|--------|
| **cpp00** | jul 2-6 | 5 days | basics, i/o, classes |
| **cpp01** | jul 8-9 | 2 days | memory, references, pointers |
| **cpp02** | jul 17 | 1 day | fixed-point, operator overloading |
| **cpp03** | jul 21-22 | 2 days | inheritance |
| **cpp04** | jul 24 | 1 day | polymorphism, abstract classes |
| **cpp05** | aug 11 | 1 day | exceptions, forms |
| **cpp06** | aug 19-20 | 2 days | type casting |
| **cpp07** | sep 23 | 1 day | templates |
| **cpp08** | sep 26 | 1 day | stl containers, iterators |
| **cpp09** | dec 2-18 | 17 days | stl advanced, algorithms |

## project structure

```
0x12-cppmodel/
├── cpp00/      # namespaces, classes, i/o (megaphone, phonebook, account)
├── cpp01/      # memory allocation, references (zombie, weapon, harl)
├── cpp02/      # fixed-point, operators (orthodox canonical form)
├── cpp03/      # inheritance (claptrap, scavtrap, fragtrap, diamondtrap)
├── cpp04/      # polymorphism (virtual functions, abstract classes, materia)
├── cpp05/      # exceptions (bureaucrat, forms, intern)
├── cpp06/      # type casting (scalar converter, serialization, type id)
├── cpp07/      # templates (function templates, iter, array)
├── cpp08/      # stl containers (easyfind, span, mutant stack)
└── cpp09/      # stl advanced (bitcoin exchange, rpn calculator, merge-insert sort)
```

## module details

**cpp00**: namespaces (`std::`), classes/objects, member functions, `iostream`, constructors/destructors, access specifiers  
**cpp01**: `new`/`delete`, stack vs heap, references (`&`), pointers to member functions, file i/o (`ifstream`, `ofstream`)  
**cpp02**: orthodox canonical form (ocf), copy constructor, assignment operator, operator overloading (`+`, `-`, `*`, `/`, `>`, `<`), const correctness  
**cpp03**: inheritance (`class derived : public base`), protected members, virtual inheritance, diamond problem, constructor/destructor order  
**cpp04**: virtual functions, pure virtual (`= 0`), abstract classes, polymorphism, deep copy, virtual destructors, `dynamic_cast`  
**cpp05**: `try`/`catch`/`throw`, custom exceptions, `std::exception`, exception safety, raii  
**cpp06**: `static_cast`, `dynamic_cast`, `reinterpret_cast`, `const_cast`, `typeid`, serialization  
**cpp07**: function/class templates, template instantiation, template specialization, type deduction, generic programming  
**cpp08**: stl containers (`vector`, `list`, `deque`, `stack`), iterators (begin/end), algorithms (`std::find`, `std::sort`), container adapters  
**cpp09**: `std::map`/`std::pair`, stack-based evaluation, algorithm complexity, merge-insert sort (ford-johnson), performance comparison

## compilation

```bash
cd cpp00/ex00  # navigate to exercise
make           # compile
./executable   # run
make clean     # clean objects
make fclean    # full clean
make re        # recompile
```

**flags**: `-Wall -Wextra -Werror -std=c++98`

## usage examples

```bash
# cpp00 - phonebook
cd cpp00/ex01 && make && ./phonebook  # add, search, exit

# cpp07 - templates
cd cpp07/ex00 && make && ./templates  # swap, min, max with different types

# cpp09 - bitcoin exchange
cd cpp09/ex00 && make && ./btc input.txt  # calculate bitcoin values

# cpp09 - rpn calculator
cd cpp09/ex01 && make && ./RPN "3 4 + 2 *"  # output: 14
```

## key concepts

**orthodox canonical form (ocf)**:
```cpp
class myclass {
public:
    myclass();                              // default constructor
    myclass(const myclass& other);          // copy constructor
    myclass& operator=(const myclass& other);  // assignment operator
    ~myclass();                             // destructor
};
```

**virtual destructor**:
```cpp
class base { public: virtual ~base() {} };  // always virtual in base classes
class derived : public base { public: ~derived() {} };  // automatically virtual
```

**exception handling**:
```cpp
try { throw std::exception(); }
catch (const std::exception& e) { std::cerr << "error: " << e.what() << std::endl; }
```

**template function**:
```cpp
template <typename t>
void swap(t& a, t& b) { t temp = a; a = b; b = temp; }
```

## best practices

- c++98 standard compliance
- orthodox canonical form for every class
- virtual destructor for base classes with virtual functions
- prefer references over pointers, use initialization lists
- raii for resource management, const correctness
- no memory leaks (verify with valgrind/leaks)

## common pitfalls

**memory leak**: `myclass* obj = new myclass();` → forgot `delete obj;` (better: use stack `myclass obj;`)  
**non-virtual destructor**: `class base { ~base() {} };` → should be `virtual ~base() {}`  
**shallow copy**: `myclass(const myclass& other) : data(other.data) {}` → should deep copy: `data(new int(*other.data))`

## testing

```bash
make && ./executable                    # run tests
valgrind --leak-check=full ./executable  # memory check (linux)
leaks -atExit -- ./executable           # memory check (macos)
```

## requirements

- compilation: `-Wall -Wextra -Werror -std=c++98`
- forbidden: c++11+ features, `printf` (use `std::cout`), external libs (except stl), memory leaks, `using namespace std;` in headers
- required: ocf for all classes, virtual destructors, proper exception handling

## complexity analysis (cpp09)

**bitcoin exchange**: time O(log n) map lookup, space O(n)  
**rpn calculator**: time O(n) evaluation, space O(n) stack  
**pmergeMe**: time O(n log n) average, space O(n) temporary

## design patterns

factory (cpp05/ex03), strategy (cpp04/ex03), singleton (cpp06/ex00), iterator (cpp08/ex02), template method (cpp07/all)

---

**grade**: validated ✅  
**developed by**: sbouabid  
**status**: 10 modules completed, 33 exercises total  
**Start Date**: July 2, 2024
**End Date**: December 18, 2024
**Total Duration**: 139 days (~5.5 months)
*"from basics to mastery - a complete c++ journey!"* 🚀